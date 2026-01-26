import {Pool} from 'pg';
import { City } from '@/entities/City';

export class CityRepo {
  constructor(private pool: Pool) {}

  async create(city: City): Promise<City> {
    const result = await this.pool.query(`
      INSERT INTO city (city) VALUES ($1)
      RETURNING *;
    `, [city.city]);
    return result.rows[0];
  }

  async findById(id: string): Promise<City | null> {
    const result = await this.pool.query(`
      SELECT * FROM city WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async update(city: City): Promise<City | null> {
    if (!city.id) {
      throw new Error("City ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE city SET city = $1, country_id = $2 WHERE id = $3
      RETURNING *;
    `, [city.city, city.country_id, city.id]);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM city WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }

}