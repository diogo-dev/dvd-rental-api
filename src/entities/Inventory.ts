export class Inventory {
  readonly id?: string;
  film_id: string;
  store_id: string;

  constructor (film_id: string, store_id: string) {
    this.film_id = film_id;
    this.store_id = store_id;
  }
}