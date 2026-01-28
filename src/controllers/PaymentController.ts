import { Request, Response } from "express";
import { PaymentService } from "@/services/PaymentService";
import z from "zod";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async processRentalPayment(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      rentalId: z.string().uuid(),
      customerId: z.string().uuid(),
      staffId: z.string().uuid(),
    });

    const params = schema.parse(req.body);

    try {
      const payment = await this.paymentService.processRentalPayment(
        params.rentalId,
        params.customerId,
        params.staffId
      );
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error processing rental payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPaymentsByCustomer(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      customerId: z.string().uuid(),
    });

    const { customerId } = schema.parse(req.params);

    try {
      const payments = await this.paymentService.getPaymentsByCustomer(customerId);
      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching payments by customer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getTotalPaidByCustomer(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      customerId: z.string().uuid(),
    });

    const { customerId } = schema.parse(req.params);

    try {
      const total = await this.paymentService.getTotalPaidByCustomer(customerId);
      res.status(200).json({ customerId, total });
    } catch (error) {
      console.error("Error fetching total paid by customer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPaymentsByDateRange(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    });

    const { startDate, endDate } = schema.parse(req.query);

    try {
      const payments = await this.paymentService.getPaymentsByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching payments by date range:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRevenueByDateRange(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    });

    const { startDate, endDate } = schema.parse(req.query);

    try {
      const revenue = await this.paymentService.getRevenueByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
      res.status(200).json({ startDate, endDate, revenue });
    } catch (error) {
      console.error("Error fetching revenue by date range:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPaymentReceipt(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      paymentId: z.string().uuid(),
    });

    const { paymentId } = schema.parse(req.params);

    try {
      const receipt = await this.paymentService.getPaymentReceipt(paymentId);
      res.status(200).json(receipt);
    } catch (error) {
      console.error("Error fetching payment receipt:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
