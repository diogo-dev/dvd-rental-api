import Router from "express";
import pool from "@/config/db/pool_pg";
import { RentalService } from "@/services/RentalService";
import { RentalController } from "@/controllers/RentalController";

export const RentalRouter = Router();
const rentalService = new RentalService(pool);
const rentalController = new RentalController(rentalService);

// Get all rentals
RentalRouter.get("/", async (req, res, next) => {
  await rentalController.getAllRentals(req, res, next);
});

// Get only active rentals
RentalRouter.get("/active", async (req, res, next) => {
  await rentalController.getActiveRentals(req, res, next);
});

// Get rentals that are overdue
RentalRouter.get("/overdue", async (req, res, next) => {
  await rentalController.getOverdueRentals(req, res, next);
});

// Get rentals by customer
RentalRouter.get("/customer/:customerId", async (req, res, next) => {
  await rentalController.getRentalsByCustomer(req, res, next);
});

// Create a new rental
RentalRouter.post("/", async (req, res, next) => {
  await rentalController.createNewRental(req, res, next);
});

// Return a rental
RentalRouter.patch("/:id/return", async (req, res, next) => {
  await rentalController.returnRental(req, res, next);
});

// Extend a rental return date
RentalRouter.patch("/:id/extend", async (req, res, next) => {
  await rentalController.extendRental(req, res, next);
});

// Delete a rental
RentalRouter.delete("/:id", async (req, res, next) => {
  await rentalController.deleteRental(req, res, next);
});