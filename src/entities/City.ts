export class City {
  readonly id?: string;
  city: string;
  country_id: string;

  constructor (city: string, country_id: string) {
    this.city = city;
    this.country_id = country_id;
  }
}