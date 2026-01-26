export class Rental {
  readonly id?: string;
  rental_date: Date;
  return_date: Date;
  inventory_id: string;
  customer_id: string;
  staff_id: string;

  constructor (
    rental_date: Date,
    return_date: Date,
    inventory_id: string,
    customer_id: string,
    staff_id: string
  ) {
    this.rental_date = rental_date;
    this.return_date = return_date;
    this.inventory_id = inventory_id;
    this.customer_id = customer_id;
    this.staff_id = staff_id;
  }
}