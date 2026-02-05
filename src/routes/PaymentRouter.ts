import Router from "express";
import { PaymentService } from "@/services/PaymentService";
import { PaymentController } from "@/controllers/PaymentController";
import pool from "@/config/db/pool_pg";

export const PaymentRouter = Router();
const paymentService = new PaymentService(pool);
const paymentController = new PaymentController(paymentService);

// Process payment for a rental
PaymentRouter.post("/", async (req, res, next) => {
  await paymentController.processRentalPayment(req, res, next);
});

// Get all payments from a customer
PaymentRouter.get("/customer/:customerId", async (req, res, next) => {
  await paymentController.getPaymentsByCustomer(req, res, next);
});

// Get total amount paid by a customer
PaymentRouter.get("/customer/:customerId/total", async (req, res, next) => {
  await paymentController.getTotalPaidByCustomer(req, res, next);
});

// Get payments within a date range
PaymentRouter.get("/date-range", async (req, res, next) => {
  await paymentController.getPaymentsByDateRange(req, res, next);
});

// Get total revenue within a date range
PaymentRouter.get("/revenue", async (req, res, next) => {
  await paymentController.getRevenueByDateRange(req, res, next);
});

// Get detailed payment receipt
PaymentRouter.get("/:paymentId/receipt", async (req, res, next) => {
  await paymentController.getPaymentReceipt(req, res, next);
});
