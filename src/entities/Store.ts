export class Store {
  readonly id?: string;
  manager_staff_id?: string;
  address_id: string;

  constructor (address_id: string, manager_staff_id?: string) {
    this.address_id = address_id;
    this.manager_staff_id = manager_staff_id;
  }
}