export class Staff {
  readonly id?: string;
  first_name: string;
  last_name: string; 
  email: string;
  username: string;
  password: string;
  active?: boolean;
  address_id: string;
  store_id: string;

  constructor (
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
    address_id: string,
    store_id: string,
    active?: boolean,
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.username = username;
    this.password = password;
    this.active = active || true;
    this.address_id = address_id;
    this.store_id = store_id;
  }
}