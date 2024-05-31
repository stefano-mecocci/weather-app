export default interface Weather {
  temperature: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  main: string;
  day: Date;
}
