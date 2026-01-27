export class Customer {
  readonly id?: string;
  first_name: string;
  last_name: string;
  email: string;
  active?: boolean;
  address_id: string;
  store_id: string;

  constructor (
    first_name: string,
    last_name: string,
    email: string,
    address_id: string,
    store_id: string,
    active?: boolean,
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.address_id = address_id;
    this.store_id = store_id;
    this.active = active ?? true;
  }
}