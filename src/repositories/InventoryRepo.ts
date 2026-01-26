import { Pool } from "pg";
import { Inventory } from "@/entities/Inventory";

export class InventoryRepo {
  constructor(private pool: Pool) {}

  async create(inventory: Inventory): Promise<Inventory> {
    const result = await this.pool.query(`
      INSERT INTO inventory (film_id, store_id)
      VALUES ($1, $2)
      RETURNING *;
    `, [
      inventory.film_id,
      inventory.store_id
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<Inventory[]> {
    const result = await this.pool.query(`
      SELECT * FROM inventory;
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Inventory | null> {
    const result = await this.pool.query(`
      SELECT * FROM inventory WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async findByFilm(filmId: string): Promise<Inventory[]> {
    const result = await this.pool.query(`
      SELECT * FROM inventory WHERE film_id = $1;
    `, [filmId]);
    return result.rows;
  }

  async findByStore(storeId: string): Promise<Inventory[]> {
    const result = await this.pool.query(`
      SELECT * FROM inventory WHERE store_id = $1;
    `, [storeId]);
    return result.rows;
  }

  async findAvailableByFilmAndStore(filmId: string, storeId: string): Promise<Inventory[]> {
    const result = await this.pool.query(`
      SELECT i.* FROM inventory i
      WHERE i.film_id = $1 AND i.store_id = $2
      AND NOT EXISTS (
        SELECT 1 FROM rental r
        WHERE r.inventory_id = i.id
        AND r.return_date > NOW()
      );
    `, [filmId, storeId]);
    return result.rows;
  }

  async update(inventory: Inventory): Promise<Inventory | null> {
    if (!inventory.id) {
      throw new Error("Inventory ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE inventory
      SET 
        film_id = $1,
        store_id = $2
      WHERE id = $3
      RETURNING *;
    `, [
      inventory.film_id,
      inventory.store_id,
      inventory.id
    ]);

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM inventory WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
