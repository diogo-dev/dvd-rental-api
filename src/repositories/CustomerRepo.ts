import { Pool } from "pg";
import { Customer } from "@/entities/Customer";

export class CustomerRepo {
  constructor(private pool: Pool) {}

  async create(customer: Customer): Promise<Customer> {
    const result = await this.pool.query(`
      INSERT INTO customer (first_name, last_name, email, created_at, address_id, store_id, active)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6)
      RETURNING *;
    `, [
      customer.first_name,
      customer.last_name,
      customer.email,
      customer.address_id,
      customer.store_id,
      customer.active
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<Customer[]> {
    const result = await this.pool.query(`
      SELECT * FROM customer;
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Customer | null> {
    const result = await this.pool.query(`
      SELECT * FROM customer WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const result = await this.pool.query(`
      SELECT * FROM customer WHERE email = $1;
    `, [email]);
    return result.rows[0] || null;
  }

  async findActive(): Promise<Customer[]> {
    const result = await this.pool.query(`
      SELECT * FROM customer WHERE active = true;
    `);
    return result.rows;
  }

  async findByStore(storeId: string): Promise<Customer[]> {
    const result = await this.pool.query(`
      SELECT * FROM customer WHERE store_id = $1;
    `, [storeId]);
    return result.rows;
  }

  async update(customer: Customer): Promise<Customer | null> {
    if (!customer.id) {
      throw new Error("Customer ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE customer
      SET 
        first_name = $1,
        last_name = $2,
        email = $3,
        address_id = $4,
        store_id = $5,
        active = $6
      WHERE id = $7
      RETURNING *;
    `, [
      customer.first_name,
      customer.last_name,
      customer.email,
      customer.address_id,
      customer.store_id,
      customer.active,
      customer.id
    ]);

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM customer WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
