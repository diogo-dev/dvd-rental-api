import { Pool } from "pg";
import { Staff } from "@/entities/Staff";

export class StaffRepo {
  constructor(private pool: Pool) {}

  async create(staff: Staff): Promise<Staff> {
    const result = await this.pool.query(`
      INSERT INTO staff (first_name, last_name, email, username, password, active, address_id, store_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `, [
      staff.first_name,
      staff.last_name,
      staff.email,
      staff.username,
      staff.password,
      staff.active,
      staff.address_id,
      staff.store_id
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<Staff[]> {
    const result = await this.pool.query(`
      SELECT * FROM staff;
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Staff | null> {
    const result = await this.pool.query(`
      SELECT * FROM staff WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<Staff | null> {
    const result = await this.pool.query(`
      SELECT * FROM staff WHERE email = $1;
    `, [email]);
    return result.rows[0] || null;
  }

  async findByUsername(username: string): Promise<Staff | null> {
    const result = await this.pool.query(`
      SELECT * FROM staff WHERE username = $1;
    `, [username]);
    return result.rows[0] || null;
  }

  async findActive(): Promise<Staff[]> {
    const result = await this.pool.query(`
      SELECT * FROM staff WHERE active = true;
    `);
    return result.rows;
  }

  async findByStore(storeId: string): Promise<Staff[]> {
    const result = await this.pool.query(`
      SELECT * FROM staff WHERE store_id = $1;
    `, [storeId]);
    return result.rows;
  }

  async update(staff: Staff): Promise<Staff | null> {
    if (!staff.id) {
      throw new Error("Staff ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE staff
      SET 
        first_name = $1,
        last_name = $2,
        email = $3,
        username = $4,
        password = $5,
        active = $6,
        address_id = $7,
        store_id = $8
      WHERE id = $9
      RETURNING *;
    `, [
      staff.first_name,
      staff.last_name,
      staff.email,
      staff.username,
      staff.password,
      staff.active,
      staff.address_id,
      staff.store_id,
      staff.id
    ]);

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM staff WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
