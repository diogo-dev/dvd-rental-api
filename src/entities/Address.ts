export class Address {
  readonly id?: string;
  address: string;
  address2?: string;
  district: string;
  postal_code?: string;
  phone: string;
  city_id: string;

  constructor (
    address: string,
    district: string,
    phone: string,
    city_id: string,
  ) {
    this.address = address;
    this.district = district;
    this.phone = phone;
    this.city_id = city_id;
  }
}