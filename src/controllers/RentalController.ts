import { NextFunction, Request, Response } from "express";
import z from "zod";
import { RentalService } from "@/services/RentalService";
import { asyncHandler } from "@/middleware";

export class RentalController {
  constructor(private rentalService: RentalService) {}

  getAllRentals = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rentals = await this.rentalService.getAllRentals();
    res.status(200).json(rentals);
  });

  getRentalsByCustomer = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = z.object({
      customerId: z.string().uuid(),
    });

    const { customerId } = schema.parse(req.params);

    const rentals = await this.rentalService.getRentalsByCustomer(customerId);
    res.status(200).json(rentals);
  });

  getActiveRentals = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rentals = await this.rentalService.getActiveRentals();
    res.status(200).json(rentals);
  });

  getOverdueRentals = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rentals = await this.rentalService.getOverdueRentals();
    res.status(200).json(rentals);
  });

  createNewRental = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = z.object({
      customerId: z.string().uuid(),
      filmId: z.string().uuid(),
      storeId: z.string().uuid(),
      staffId: z.string().uuid(),
    });

    const { customerId, filmId, storeId, staffId } = schema.parse(req.body);

    const rental = await this.rentalService.rentFilm(customerId, filmId, storeId, staffId);
    res.status(201).json(rental);
  });

  returnRental = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = z.object({
      rentalId: z.string().uuid(),
    });

    const { rentalId } = schema.parse(req.params);

    const rental = await this.rentalService.returnFilm(rentalId);
    res.status(200).json(rental);
  });

  extendRental = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = z.object({
      rentalId: z.string().uuid(),
      extraDays: z.number().min(1),
    });

    const { rentalId, extraDays } = schema.parse(req.body);

    const rental = await this.rentalService.extendRental(rentalId, extraDays);
    res.status(200).json(rental);
  });

  deleteRental = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = z.object({
      rentalId: z.string().uuid(),
    });
    const { rentalId } = schema.parse(req.params);

    const success = await this.rentalService.deleteRental(rentalId);
    res.status(200).json({ message: "Rental deleted successfully" });
  });


}