import { Pool } from "pg";
import { Film } from "@/entities/Film";

interface FilmRecord {
  id: string;
  title: string;
  description: string | null;
  release_year: number | null;
  rental_duration: number;
  rental_rate: number | null;
  length: number | null;
  replacement_cost: number;
  rating: string | null;
  fulltext: string | null;
}

export class FilmRepo {
  constructor(private pool: Pool) {}

  async create(film: Film): Promise<Film> {
    const result = await this.pool.query(`
      INSERT INTO film (title, description, release_year, rental_duration, rental_rate, length, replacement_cost, rating, fulltext)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, to_tsvector($1 || ' ' || coalesce($2, '')))
      RETURNING *;
    `, [
      film.title,
      film.description || null,
      film.release_year || null,
      film.rental_duration,
      film.rental_rate || null,
      film.length || null,
      film.replacement_cost,
      film.rating || null
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<Film[]> {
    const result = await this.pool.query(`
      SELECT * FROM film;
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Film | null> {
    const result = await this.pool.query(`
      SELECT * FROM film WHERE id = $1;
    `, [id]);
    return this.deserialize(result.rows[0]) || null;
  }

  async searchByTitle(title: string): Promise<Film[]> {
    if (!title.trim()) return [];
    
    const query = title.trim().split(/\s+/).map(word => 
      word.replace(/[^a-zA-Z0-9]/g, '')
    ).filter(w => w).join(' | ');
    
    if (!query) return [];
    
    const result = await this.pool.query(`
      SELECT * FROM film
      WHERE fulltext @@ to_tsquery('simple', $1);
    `, [query]);
    
    return result.rows.map(row => this.deserialize(row));
  }

  async update(film: Film): Promise<Film | null> {
    if (!film.id) {
      throw new Error("Film ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE film
      SET 
        title = $1,
        description = $2,
        release_year = $3,
        rental_duration = $4,
        rental_rate = $5,
        length = $6,
        replacement_cost = $7,
        rating = $8,
        fulltext = to_tsvector($1 || ' ' || coalesce($2, ''))
      WHERE id = $9
      RETURNING *;
    `, [
      film.title,
      film.description || null,
      film.release_year || null,
      film.rental_duration,
      film.rental_rate || null,
      film.length || null,
      film.replacement_cost,
      film.rating || null,
      film.id
    ]);

    return result.rows[0] || null;
  }

  async updatePartial(id: string, data: Partial<Film>): Promise<Film | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.release_year !== undefined) {
      fields.push(`release_year = $${paramIndex++}`);
      values.push(data.release_year);
    }
    if (data.rental_duration !== undefined) {
      fields.push(`rental_duration = $${paramIndex++}`);
      values.push(data.rental_duration);
    }
    if (data.rental_rate !== undefined) {
      fields.push(`rental_rate = $${paramIndex++}`);
      values.push(data.rental_rate);
    }
    if (data.length !== undefined) {
      fields.push(`length = $${paramIndex++}`);
      values.push(data.length);
    }
    if (data.replacement_cost !== undefined) {
      fields.push(`replacement_cost = $${paramIndex++}`);
      values.push(data.replacement_cost);
    }
    if (data.rating !== undefined) {
      fields.push(`rating = $${paramIndex++}`);
      values.push(data.rating);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    // Atualiza fulltext se title ou description foram modificados
    if (data.title !== undefined || data.description !== undefined) {
      const titleIndex = data.title !== undefined ? paramIndex++ : 'title';
      const descIndex = data.description !== undefined ? paramIndex++ : 'description';
      
      fields.push(`fulltext = to_tsvector(
        coalesce($${titleIndex}, title) || ' ' || 
        coalesce($${descIndex}, description, '')
      )`);
      
      if (data.title !== undefined) values.push(data.title);
      if (data.description !== undefined) values.push(data.description);
    }

    values.push(id);

    const result = await this.pool.query(`
      UPDATE film
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `, values);

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM film WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  private deserialize(row: FilmRecord): Film {
    const film = new Film(row.title, row.rental_duration, row.replacement_cost);
    
    film.description = row.description || undefined;
    film.release_year = row.release_year || undefined;
    film.rental_rate = row.rental_rate || undefined;
    film.length = row.length || undefined;
    film.rating = row.rating || undefined;
    film.fulltext = row.fulltext || undefined;

    return film;
  }

}