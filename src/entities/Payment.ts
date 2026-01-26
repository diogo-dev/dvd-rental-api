export class Payment {
  readonly id?: string;
  amount: number;
  payment_date: Date;
  rental_id: string;
  customer_id: string;
  staff_id: string;

  constructor (
    amount: number,
    payment_date: Date,
    rental_id: string,
    customer_id: string,
    staff_id: string
  ) {
    this.amount = amount;
    this.payment_date = payment_date;
    this.rental_id = rental_id;
    this.customer_id = customer_id;
    this.staff_id = staff_id;
  }
}