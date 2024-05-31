import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ForecastCardComponent } from './component/forecast-card/forecast-card.component';
import { WeatherService } from './service/weather.service';
import { CurrentCardComponent } from './component/current-card/current-card.component';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  share,
  switchMap,
  tap,
} from 'rxjs';
import Weather from './model/weather.model';
import { CommonModule } from '@angular/common';
import { LoaderService } from './service/loader.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { cluster } from 'radash';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ForecastCardComponent,
    CurrentCardComponent,
    CommonModule,
    BaseChartDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  city$ = new Subject<string>();
  currentWeather$: Observable<Weather>;
  forecastWeather$: Observable<Weather[]>;
  graphWeather$: Observable<ChartConfiguration<'line'>['data']>;

  loadingCurrent$: Observable<boolean>;
  loadingForecast$: Observable<boolean>;

  cityDoesntExists$ = new BehaviorSubject<boolean>(false);
  cityFound$ = new BehaviorSubject<boolean>(true);

  emptyW: Weather = {
    temperature: 0,
    temp_min: 0,
    temp_max: 0,
    humidity: 0,
    wind_speed: 0,
    main: '',
    day: new Date(),
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor(
    private weatherService: WeatherService,
    private loaderService: LoaderService
  ) {
    this.loadingCurrent$ = loaderService.getLoader('currentWeather');
    this.loadingForecast$ = loaderService.getLoader('forecastWeather');

    const cityCoords$ = this.setupCityCoordsObservable();

    this.currentWeather$ = cityCoords$.pipe(
      tap(() => this.loaderService.start('currentWeather')),
      switchMap((coords) =>
        this.weatherService.getCurrentWeather(coords?.lat, coords?.lon)
      ),
      tap(() => this.loaderService.stop('currentWeather'))
    );

    const underWeather$ = cityCoords$.pipe(
      tap(() => this.loaderService.start('forecastWeather')),
      switchMap((coords) =>
        this.weatherService.getForecastWeather(coords?.lat, coords?.lon)
      ),
      tap(() => this.loaderService.stop('forecastWeather')),
      share()
    );

    this.forecastWeather$ = underWeather$.pipe(
      map((list) => cluster(list, 8).map((x) => x[0])) // solo il primo di ogni giorno
    );
    this.graphWeather$ = underWeather$.pipe(
      map(this.convertWeatherDataToGraph)
    );
  }

  private setupCityCoordsObservable() {
    return this.city$.pipe(
      tap(() => {
        this.cityFound$.next(true);
        this.cityDoesntExists$.next(false);
      }),
      debounceTime(400),
      distinctUntilChanged(),
      filter((city) => city.trim() != ''),
      switchMap((city) => this.weatherService.getCityCoords(city)),
      catchError(() => EMPTY),
      tap((coords) => {
        this.cityFound$.next(coords == null);
        this.cityDoesntExists$.next(coords == null);
      }),
      filter((coords) => coords != null),
      share()
    );
  }

  private convertWeatherDataToGraph(weathers: Weather[]) {
    return {
      labels: weathers.map((w) => w.day.getHours()),
      datasets: [
        {
          data: weathers.map((x) => x.temperature),
          label: 'Temperatures',
          fill: true,
          tension: 0.5,
          borderColor: '#97e5f7',
          backgroundColor: 'rgba(196,244,255,0.4)',
        },
      ],
    };
  }

  moveUp(event: Event) {
    const input = event.target as HTMLInputElement;
    input.style.top = '0px';
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.city$.next(input.value);
  }
}
