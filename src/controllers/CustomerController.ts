import { Request, Response } from "express";
import { CustomerService } from "@/services/CustomerService";
import z from "zod";

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  async registerCustomer(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      addressId: z.string().uuid(),
      storeId: z.string().uuid(),
    });

    const params = schema.parse(req.body);

    try {
      const customer = await this.customerService.registerCustomer(
        params.firstName,
        params.lastName,
        params.email,
        params.addressId,
        params.storeId
      );
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error registering customer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCustomerProfile(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      customerId: z.string().uuid(),
    });

    const { customerId } = schema.parse(req.params);

    try {
      const profile = await this.customerService.getCustomerProfile(customerId);
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getRentalHistory(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      customerId: z.string().uuid(),
    });

    const { customerId } = schema.parse(req.params);

    try {
      const rentals = await this.customerService.getRentalHistory(customerId);
      res.status(200).json(rentals);
    } catch (error) {
      console.error("Error fetching rental history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getPaymentHistory(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      customerId: z.string().uuid(),
    });

    const { customerId } = schema.parse(req.params);

    try {
      const payments = await this.customerService.getPaymentHistory(customerId);
      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deactivateCustomer(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      customerId: z.string().uuid(),
    });

    const { customerId } = schema.parse(req.params);

    try {
      const customer = await this.customerService.deactivateCustomer(customerId);
      res.status(200).json(customer);
    } catch (error) {
      console.error("Error deactivating customer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async activateCustomer(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      customerId: z.string().uuid(),
    });

    const { customerId } = schema.parse(req.params);

    try {
      const customer = await this.customerService.activateCustomer(customerId);
      res.status(200).json(customer);
    } catch (error) {
      console.error("Error activating customer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateCustomerInfo(req: Request, res: Response): Promise<void> {
    const paramsSchema = z.object({
      customerId: z.string().uuid(),
    });

    const bodySchema = z.object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      email: z.string().email().optional(),
      addressId: z.string().uuid().optional(),
    });

    const { customerId } = paramsSchema.parse(req.params);
    const customerData = bodySchema.parse(req.body);

    try {
      const customer = await this.customerService.updateCustomerInfo(
        customerId,
        customerData
      );
      res.status(200).json(customer);
    } catch (error) {
      console.error("Error updating customer info:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
