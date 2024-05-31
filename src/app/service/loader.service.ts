import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loaders: Map<string, BehaviorSubject<boolean>>;

  constructor() {
    this.loaders = new Map();

    this.setLoader('currentWeather');
    this.setLoader('forecastWeather');
  }

  private setLoader(id: string) {
    this.loaders.set(id, new BehaviorSubject<boolean>(true));
  }

  getLoader(id: string) {
    return this.loaders.get(id)?.asObservable() as Observable<boolean>;
  }

  stop(id: string) {
    this.loaders.get(id)?.next(false);
  }

  start(id: string) {
    this.loaders.get(id)?.next(true);
  }
}
