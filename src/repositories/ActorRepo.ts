import {Pool} from "pg";
import { Actor } from "@/entities/Actor";

export class ActorRepo {
  constructor(private pool: Pool) {}

  async create(actor: Actor): Promise<Actor> {
    const result = await this.pool.query(`
      INSERT INTO actor (first_name, last_name) VALUES ($1, $2) 
      RETURNING *;
    `, [actor.first_name, actor.last_name]);

    return result.rows[0];
  } 

  async findById(id: string): Promise<Actor | null> {
    const result = await this.pool.query(`
      SELECT * FROM actor WHERE id = $1;
    `, [id]);

    return result.rows[0] || null;
  }

  async update(actor: Actor): Promise<Actor | null> {
    if (!actor.id) {
      throw new Error("Actor ID is required for update.");
    }

    const result = await this.pool.query(`
      UPDATE actor SET first_name = $1, last_name = $2 WHERE id = $3
      RETURNING *;
    `, [actor.first_name, actor.last_name, actor.id]);

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM actor WHERE id = $1;
    `, [id]);

    return (result.rowCount ?? 0) > 0;
  }

}