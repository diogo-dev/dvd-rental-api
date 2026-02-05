import Router from "express";
import { CustomerService } from "@/services/CustomerService";
import { CustomerController } from "@/controllers/CustomerController";
import pool from "@/config/db/pool_pg";

export const CustomerRouter = Router();
const customerService = new CustomerService(pool);
const customerController = new CustomerController(customerService);

// Register a new customer
CustomerRouter.post("/", async (req, res, next) => {
  await customerController.registerCustomer(req, res, next);
});

// Get customer profile
CustomerRouter.get("/:customerId/profile", async (req, res, next) => {
  await customerController.getCustomerProfile(req, res, next);
});

// Get customer rental history
CustomerRouter.get("/:customerId/rentals", async (req, res, next) => {
  await customerController.getRentalHistory(req, res, next);
});

// Get customer payment history
CustomerRouter.get("/:customerId/payments", async (req, res, next) => {
  await customerController.getPaymentHistory(req, res, next);
});

// Update customer information
CustomerRouter.patch("/:customerId", async (req, res, next) => {
  await customerController.updateCustomerInfo(req, res, next);
});

// Deactivate customer
CustomerRouter.patch("/:customerId/deactivate", async (req, res, next) => {
  await customerController.deactivateCustomer(req, res, next);
});

// Activate customer
CustomerRouter.patch("/:customerId/activate", async (req, res, next) => {
  await customerController.activateCustomer(req, res, next);
});
