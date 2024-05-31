import { Component, Input } from '@angular/core';
import Weather from '../../model/weather.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forecast-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast-card.component.html',
  styleUrl: './forecast-card.component.css',
})
export class ForecastCardComponent {
  @Input() weather!: Weather;
  @Input() loading: boolean = true;
}
