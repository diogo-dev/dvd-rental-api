export class Store {
  readonly id?: string;
  manager_staff_id: string;
  address_id: string;

  constructor (manager_staff_id: string, address_id: string) {
    this.manager_staff_id = manager_staff_id;
    this.address_id = address_id;
  }
}