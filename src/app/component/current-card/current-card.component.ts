import { Component, Input } from '@angular/core';
import Weather from '../../model/weather.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-card.component.html',
  styleUrl: './current-card.component.css',
})
export class CurrentCardComponent {
  @Input() currentWeather!: Weather;
  @Input() loading: boolean = true;
}
