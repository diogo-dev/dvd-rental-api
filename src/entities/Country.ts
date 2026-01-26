export class Country {
  readonly id?: string;
  name: string;

  constructor (name: string) {
    this.name = name;
  }
}