import { Pool } from "pg";
import { Payment } from "@/entities/Payment";

export class PaymentRepo {
  constructor(private pool: Pool) {}

  async create(payment: Payment): Promise<Payment> {
    const result = await this.pool.query(`
      INSERT INTO payment (amount, payment_date, rental_id, customer_id, staff_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [
      payment.amount,
      payment.payment_date,
      payment.rental_id,
      payment.customer_id,
      payment.staff_id
    ]);
    return result.rows[0];
  }

  async findAll(): Promise<Payment[]> {
    const result = await this.pool.query(`
      SELECT * FROM payment;
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await this.pool.query(`
      SELECT * FROM payment WHERE id = $1;
    `, [id]);
    return result.rows[0] || null;
  }

  async findByRental(rentalId: string): Promise<Payment[]> {
    const result = await this.pool.query(`
      SELECT * FROM payment WHERE rental_id = $1;
    `, [rentalId]);
    return result.rows;
  }

  async findByCustomer(customerId: string): Promise<Payment[]> {
    const result = await this.pool.query(`
      SELECT * FROM payment WHERE customer_id = $1;
    `, [customerId]);
    return result.rows;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    const result = await this.pool.query(`
      SELECT * FROM payment 
      WHERE payment_date BETWEEN $1 AND $2
      ORDER BY payment_date DESC;
    `, [startDate, endDate]);
    return result.rows;
  }

  async getTotalByCustomer(customerId: string): Promise<number> {
    const result = await this.pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM payment 
      WHERE customer_id = $1;
    `, [customerId]);
    return parseFloat(result.rows[0].total);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(`
      DELETE FROM payment WHERE id = $1;
    `, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
