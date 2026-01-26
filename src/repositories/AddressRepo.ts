import { Pool } from "pg";
import { Address } from "@/entities/Address";

export class AddressRepo {
  constructor(private pool: Pool) {}

  async create(address: Address): Promise<Address> {
    const result = await this.pool.query(`
      INSERT INTO address (address, address2, district, city_id, postal_code, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [
      address.address,
      address.address2 || null,
      address.district,
      address.city_id,
      address.postal_code || null,
      address.phone
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<Address[]> {
    const result = await this.pool.query(`
      SELECT * FROM address;
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Address | null> {
    const result = await this.pool.query(`
      SELECT * FROM address WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async findByCity(cityId: string): Promise<Address[]> {
    const result = await this.pool.query(`
      SELECT * FROM address WHERE city_id = $1;
    `, [cityId]);
    return result.rows;
  }

  async update(address: Address): Promise<Address | null> {
    if (!address.id) {
      throw new Error("Address ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE address
      SET 
        address = $1,
        address2 = $2,
        district = $3,
        city_id = $4,
        postal_code = $5,
        phone = $6
      WHERE id = $7
      RETURNING *;
    `, [
      address.address,
      address.address2 || null,
      address.district,
      address.city_id,
      address.postal_code || null,
      address.phone,
      address.id
    ]);

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM address WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
