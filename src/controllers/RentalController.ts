import { Request, Response } from "express";
import z from "zod";
import { RentalService } from "@/services/RentalService";

export class RentalController {
  constructor(private rentalService: RentalService) {}

  async getAllRentals(req: Request, res: Response): Promise<void> {
    try {
      const rentals = await this.rentalService.getAllRentals();
      res.status(200).json(rentals);
    } catch (error) {
      console.error("Error fetching all rentals:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  async getRentalsByCustomer(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      customerId: z.string().uuid(),
    })

    const { customerId } = schema.parse(req.params);

    try {
      const rentals = await this.rentalService.getRentalsByCustomer(customerId);
      res.status(200).json(rentals);
    } catch (error) {
      console.error(`Error fetching rentals for customer ${customerId}:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getActiveRentals(req: Request, res: Response): Promise<void> {
    try {
      const rentals = await this.rentalService.getActiveRentals();
      res.status(200).json(rentals);
    } catch (error) {
      console.error("Error fetching active rentals:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getOverdueRentals(req: Request, res: Response): Promise<void> {
    try {
      const rentals = await this.rentalService.getOverdueRentals();
      res.status(200).json(rentals);
    } catch (error) {
      console.error("Error fetching overdue rentals:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createNewRental (req: Request, res: Response): Promise<void> {
    const schema = z.object({
      customerId: z.string().uuid(),
      filmId: z.string().uuid(),
      storeId: z.string().uuid(),
      staffId: z.string().uuid(),
    });

    const { customerId, filmId, storeId, staffId } = schema.parse(req.body);

    try {
      const rental = await this.rentalService.rentFilm(customerId, filmId, storeId, staffId);
      res.status(201).json(rental);
    } catch (error) {
      console.error("Error creating rental:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async returnRental(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      rentalId: z.string().uuid()
    })

    const { rentalId } = schema.parse(req.params);

    try {
      const rental = await this.rentalService.returnFilm(rentalId);
      res.status(200).json(rental);
    } catch (error) {
      console.error(`Error returning rental ${rentalId}:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async extendRental(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      rentalId: z.string().uuid(),
      extraDays: z.number().min(1)
    });

    const { rentalId, extraDays } = schema.parse(req.body);

    try {
      const rental = await this.rentalService.extendRental(rentalId, extraDays);
      res.status(200).json(rental);
    } catch (error) {
      console.error(`Error extending rental ${rentalId}:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteRental(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      rentalId: z.string().uuid()
    });
    const { rentalId } = schema.parse(req.params);

    try {
      const success = await this.rentalService.deleteRental(rentalId);
      if (success) {
        res.status(200).json({ message: "Rental deleted successfully" });
      } else {
        res.status(404).json({ error: "Rental not found" });
      }
    } catch (error) {
      console.error(`Error deleting rental ${rentalId}:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  }


}