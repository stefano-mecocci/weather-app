import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable, filter, map } from 'rxjs';
import Weather from '../model/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // weather = corrente
  // forecast = 5 giorni con intervalli di 3 ore (= 3 * 8 quindi 5 * 8 = 40 elementi)
  WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
  GEO_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient) {}

  getCityCoords(city: string) {
    const url = `${this.GEO_API_URL}`;
    const params = new HttpParams()
      .set('appid', environment.apiKey)
      .set('q', city);

    return this.http.get(url, { params }).pipe(
      map((cities: any) => {
        if (cities.length > 0) {
          return { lat: cities[0].lat, lon: cities[0].lon };
        }

        return null;
      })
    );
  }

  private normalizeWeatherData(rawWeatherData: any): Weather {
    const cleanData: Weather = {
      wind_speed: rawWeatherData.wind.speed,
      temperature: Math.round(rawWeatherData.main.temp),
      temp_max: Math.round(rawWeatherData.main.temp_max),
      temp_min: Math.round(rawWeatherData.main.temp_min),
      humidity: rawWeatherData.main.humidity,
      main: rawWeatherData.weather[0].main,
      day: new Date(rawWeatherData.dt_txt),
    };

    return cleanData;
  }

  private prepareParams(lat: string, lon: string) {
    const params = new HttpParams()
      .set('appid', environment.apiKey)
      .set('units', 'metric')
      .set('lat', lat)
      .set('lon', lon);

    return params;
  }

  getCurrentWeather(lat: string, lon: string) {
    const url = `${this.WEATHER_API_URL}/weather`;
    const params = this.prepareParams(lat, lon);

    return this.http
      .get(url, { params })
      .pipe(map((rawWeatherData) => this.normalizeWeatherData(rawWeatherData)));
  }

  getForecastWeather(lat: string, lon: string): Observable<Weather[]> {
    const url = `${this.WEATHER_API_URL}/forecast`;
    const params = this.prepareParams(lat, lon);

    return this.http.get(url, { params }).pipe(
      map(({ list }: any) => {
        const cleanList = list.map(this.normalizeWeatherData) as Weather[]; // 40 elementi = 8 elementi al giorno dato che 3h * 8 = 24h

        return cleanList;
      })
    );
  }
}
