import Router from "express";
import pool from "../config/db/pool_pg.js";
import { RentalService } from "@/services/RentalService.js";
import { RentalController } from "@/controllers/RentalController.js";

export const RentalRouter = Router();
const rentalService = new RentalService(pool);
const rentalController = new RentalController(rentalService);

// Get all rentals
RentalRouter.get("/", async (req, res) => {
  await rentalController.getAllRentals(req, res);
});

// Get only active rentals
RentalRouter.get("/active", async (req, res) => {
  await rentalController.getActiveRentals(req, res);
});

// Get rentals that are overdue
RentalRouter.get("/overdue", async (req, res) => {
  await rentalController.getOverdueRentals(req, res);
});

// Get rentals by customer
RentalRouter.get("/customer/:customerId", async (req, res) => {
  await rentalController.getRentalsByCustomer(req, res);
});

// Create a new rental
RentalRouter.post("/", async (req, res) => {
  await rentalController.createNewRental(req, res);
});

// Return a rental
RentalRouter.patch("/:id/return", async (req, res) => {
  await rentalController.returnRental(req, res);
});

// Extend a rental return date
RentalRouter.patch("/:id/extend", async (req, res) => {
  await rentalController.extendRental(req, res);
});

// Delete a rental
RentalRouter.delete("/:id", async (req, res) => {
  await rentalController.deleteRental(req, res);
});