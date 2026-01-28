import Router from "express";
import { CustomerService } from "@/services/CustomerService";
import { CustomerController } from "@/controllers/CustomerController";
import pool from "@/config/db/pool_pg";

export const CustomerRouter = Router();
const customerService = new CustomerService(pool);
const customerController = new CustomerController(customerService);

// Register a new customer
CustomerRouter.post("/customer/register", async (req, res) => {
  await customerController.registerCustomer(req, res);
});

// Get customer profile
CustomerRouter.get("/:customerId/profile", async (req, res) => {
  await customerController.getCustomerProfile(req, res);
});

// Get customer rental history
CustomerRouter.get("/:customerId/rentals", async (req, res) => {
  await customerController.getRentalHistory(req, res);
});

// Get customer payment history
CustomerRouter.get("/:customerId/payments", async (req, res) => {
  await customerController.getPaymentHistory(req, res);
});

// Update customer information
CustomerRouter.patch("/:customerId", async (req, res) => {
  await customerController.updateCustomerInfo(req, res);
});

// Deactivate customer
CustomerRouter.patch("/:customerId/deactivate", async (req, res) => {
  await customerController.deactivateCustomer(req, res);
});

// Activate customer
CustomerRouter.patch("/:customerId/activate", async (req, res) => {
  await customerController.activateCustomer(req, res);
});
