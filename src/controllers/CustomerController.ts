import { NextFunction, Request, Response } from "express";
import { CustomerService } from "@/services/CustomerService";
import z from "zod";

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  async registerCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        addressId: z.string().uuid(),
        storeId: z.string().uuid(),
      });

      const params = schema.parse(req.body);
      
      const customer = await this.customerService.registerCustomer(
        params.firstName,
        params.lastName,
        params.email,
        params.addressId,
        params.storeId
      );
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        customerId: z.string().uuid(),
      });

      const { customerId } = schema.parse(req.params);

      const profile = await this.customerService.getCustomerProfile(customerId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async getRentalHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        customerId: z.string().uuid(),
      });

      const { customerId } = schema.parse(req.params);

      const rentals = await this.customerService.getRentalHistory(customerId);
      res.status(200).json(rentals);
    } catch (error) {
      next(error);
    }
  }

  async getPaymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        customerId: z.string().uuid(),
      });

      const { customerId } = schema.parse(req.params);

      const payments = await this.customerService.getPaymentHistory(customerId);
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }

  async deactivateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        customerId: z.string().uuid(),
      });

      const { customerId } = schema.parse(req.params);

      const customer = await this.customerService.deactivateCustomer(customerId);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }

  async activateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        customerId: z.string().uuid(),
      });

      const { customerId } = schema.parse(req.params);

      const customer = await this.customerService.activateCustomer(customerId);
      res.status(200).json(customer);
    } catch (error) {
      next(error);  
    }
  }

  async updateCustomerInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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

      const customer = await this.customerService.updateCustomerInfo(
        customerId,
        customerData
      );
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }
}
