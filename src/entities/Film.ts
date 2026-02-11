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

  constructor (title: string, rental_duration: number, replacement_cost: number, description?: string, release_year?: number, rental_rate?: number, length?: number, rating?: string) {
    this.title = String(title);
    this.rental_duration = rental_duration;
    this.replacement_cost = replacement_cost;
    this.description = description ? String(description) : undefined;
    this.release_year = release_year || undefined;
    this.rental_rate = rental_rate || undefined;
    this.length = length || undefined;
    this.rating = rating ? String(rating) : undefined;
  }
}