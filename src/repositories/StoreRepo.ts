import { Pool } from "pg";
import { Store } from "@/entities/Store";

export class StoreRepo {
  constructor(private pool: Pool) {}

  async create(store: Store): Promise<Store> {
    const result = await this.pool.query(`
      INSERT INTO store (manager_staff_id, address_id)
      VALUES ($1, $2)
      RETURNING *;
    `, [
      store.manager_staff_id,
      store.address_id
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<Store[]> {
    const result = await this.pool.query(`
      SELECT * FROM store;
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Store | null> {
    const result = await this.pool.query(`
      SELECT * FROM store WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async findByManager(managerStaffId: string): Promise<Store | null> {
    const result = await this.pool.query(`
      SELECT * FROM store WHERE manager_staff_id = $1;
    `, [managerStaffId]);
    return result.rows[0] || null;
  }

  async update(store: Store): Promise<Store | null> {
    if (!store.id) {
      throw new Error("Store ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE store
      SET 
        manager_staff_id = $1,
        address_id = $2
      WHERE id = $3
      RETURNING *;
    `, [
      store.manager_staff_id,
      store.address_id,
      store.id
    ]);

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM store WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
