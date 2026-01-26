import {Pool} from 'pg';
import {Country} from '@/entities/Country';

export class CountryRepo {
  constructor(private pool: Pool) {}

  async create(country: Country): Promise<Country> {
    const result = await this.pool.query(`
      INSERT INTO country (name) VALUES ($1) RETURNING *; 
    `, [country.name]);

    return result.rows[0];
  }

  async findById(id: string): Promise<Country | null> {
    const result = await this.pool.query(`
      SELECT * FROM country WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async update(country: Country): Promise<Country | null> {
    if (!country.id) {
      throw new Error("Country ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE country SET name = $1 WHERE id = $2
      RETURNING *;
    `, [country.name, country.id]);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM country WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}