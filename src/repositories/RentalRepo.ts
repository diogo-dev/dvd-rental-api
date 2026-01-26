import { Pool } from "pg";
import { Rental } from "@/entities/Rental";

export class RentalRepo {
  constructor(private pool: Pool) {}

  async create(rental: Rental): Promise<Rental> {
    const result = await this.pool.query(`
      INSERT INTO rental (rental_date, return_date, inventory_id, customer_id, staff_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [
      rental.rental_date,
      rental.return_date,
      rental.inventory_id,
      rental.customer_id,
      rental.staff_id
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<Rental[]> {
    const result = await this.pool.query(`
      SELECT * FROM rental;
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Rental | null> {
    const result = await this.pool.query(`
      SELECT * FROM rental WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async findByCustomer(customerId: string): Promise<Rental[]> {
    const result = await this.pool.query(`
      SELECT * FROM rental WHERE customer_id = $1
      ORDER BY rental_date DESC;
    `, [customerId]);
    return result.rows;
  }

  async findByInventory(inventoryId: string): Promise<Rental[]> {
    const result = await this.pool.query(`
      SELECT * FROM rental WHERE inventory_id = $1
      ORDER BY rental_date DESC;
    `, [inventoryId]);
    return result.rows;
  }

  async findActive(): Promise<Rental[]> {
    const result = await this.pool.query(`
      SELECT * FROM rental 
      WHERE return_date > NOW()
      ORDER BY rental_date DESC;
    `);
    return result.rows;
  }

  async findOverdue(): Promise<Rental[]> {
    const result = await this.pool.query(`
      SELECT * FROM rental 
      WHERE return_date < NOW()
      ORDER BY return_date ASC;
    `);
    return result.rows;
  }

  async update(rental: Rental): Promise<Rental | null> {
    if (!rental.id) {
      throw new Error("Rental ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE rental
      SET 
        rental_date = $1,
        return_date = $2,
        inventory_id = $3,
        customer_id = $4,
        staff_id = $5
      WHERE id = $6
      RETURNING *;
    `, [
      rental.rental_date,
      rental.return_date,
      rental.inventory_id,
      rental.customer_id,
      rental.staff_id,
      rental.id
    ]);

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM rental WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
