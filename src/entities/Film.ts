export class Film {
  readonly id?: string;
  title: string;
  description?: string;
  release_year?: number;
  rental_duration: number;
  rental_rate?: number;
  length?: number;
  replacement_cost: number;
  rating?: string;
  fulltext?: string;

  constructor (title: string, rental_duration: number, replacement_cost: number) {
    this.title = title;
    this.rental_duration = rental_duration;
    this.replacement_cost = replacement_cost;
  }
}