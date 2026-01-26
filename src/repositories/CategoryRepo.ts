import {Pool} from 'pg';
import {Category} from '@/entities/Category';

export class CategoryRepo {
  constructor(private pool: Pool) {}

  async create(category: Category): Promise<Category> {
    const result = await this.pool.query(`
      INSERT INTO category (name) VALUES ($1)
      RETURNING *;
    `, [category.name]);
    return result.rows[0];
  }

  async findById(id: string): Promise<Category | null> {
    const result = await this.pool.query(`
      SELECT * FROM category WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async update(category: Category): Promise<Category | null> {
    if (!category.id) {
      throw new Error("Category ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE category SET name = $1 WHERE id = $2
      RETURNING *;
    `, [category.name, category.id]);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM category WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }

}