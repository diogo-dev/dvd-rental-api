import { Pool } from "pg";
import { RentalRepo } from "@/repositories/RentalRepo";
import { InventoryRepo } from "@/repositories/InventoryRepo";
import { CustomerRepo } from "@/repositories/CustomerRepo";
import { FilmRepo } from "@/repositories/FilmRepo";
import { PaymentRepo } from "@/repositories/PaymentRepo";
import { Rental } from "@/entities/Rental";

export class RentalService {
  private rentalRepo: RentalRepo;
  private inventoryRepo: InventoryRepo;
  private customerRepo: CustomerRepo;
  private filmRepo: FilmRepo;
  private paymentRepo: PaymentRepo;

  constructor(pool: Pool) {
    this.rentalRepo = new RentalRepo(pool);
    this.inventoryRepo = new InventoryRepo(pool);
    this.customerRepo = new CustomerRepo(pool);
    this.filmRepo = new FilmRepo(pool);
    this.paymentRepo = new PaymentRepo(pool);
  }

  async rentFilm(
    customerId: string,
    filmId: string,
    storeId: string,
    staffId: string
  ): Promise<Rental> {
    // TODO: Implement film rental process
    // 1. Check if customer exists and is active (customerRepo.findById)
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) {
      throw new Error("Customer does not exist");
    }
    if (!customer.active) {
      throw new Error("Customer is not active");
    }

    // 2. Check if there is available inventory of the film in the store (inventoryRepo.findAvailableByFilmAndStore)
    const availableInventories = await this.inventoryRepo.findAvailableByFilmAndStore(filmId, storeId);

    // 3. If there is no available inventory, throw error
    if (availableInventories.length === 0) {
      throw new Error("No available inventory for the requested film in the specified store");
    }

    // 4. Fetch film data to get rental_duration (filmRepo.findById)
    const film = await this.filmRepo.findById(filmId);
    if (!film) {
      throw new Error("Film does not exist");
    }

    // 5. Calculate rental_date (now) and return_date (now + rental_duration days)
    const rentalDate = new Date();
    const rentalDuration = film.rental_duration;
    const returnDate = new Date(rentalDate);
    returnDate.setDate(returnDate.getDate() + rentalDuration);

    // 6. Create the rental (rentalRepo.create)
    const rental = new Rental(
      rentalDate,
      returnDate,
      availableInventories[0].id!,
      customerId,
      staffId
    );

    // 7. Return the created rental
    return this.rentalRepo.create(rental);
  }

  async returnFilm(rentalId: string): Promise<Rental> {
    // TODO: Implement film return
    const rental = await this.rentalRepo.findById(rentalId);
    if (!rental) {
      throw new Error("Rental does not exist");
    }
    
    // 3. Check if the film has not already been returned (compare return_date with now)
    const now = new Date();
    if (rental.return_date <= now) {
      throw new Error("Film has already been returned");
    }

    // 4. Update return_date to now (rentalRepo.update)
    rental.return_date = now;
    await this.rentalRepo.update(rental);

    return rental;
  }

  async deleteRental(rentalId: string): Promise<boolean> {
    const rental = await this.rentalRepo.findById(rentalId);
    if (!rental) {
      throw new Error("Rental deletion failed: Rental does not exist");
    }

    return this.rentalRepo.delete(rentalId);
  }

  async getAllRentals(): Promise<Rental[]> {
    const rentals = await this.rentalRepo.findAll();
    if (rentals.length === 0) {
      throw new Error("No rentals found");
    }

    return rentals;
  }

  async getRentalsByCustomer(customerId: string): Promise<Rental[]> {
    const rentals = await this.rentalRepo.findByCustomer(customerId);
    if (rentals.length === 0) {
      throw new Error("No rentals found for the specified customer");
    }
  
    return rentals;
  }

  async getActiveRentals(): Promise<Rental[]> {
    const activeRentals = await this.rentalRepo.findActive();
    if (activeRentals.length === 0) {
      throw new Error("No active rentals found");
    }
  
    return activeRentals;
  }

  async getOverdueRentals(): Promise<Rental[]> {
    const overdueRentals = await this.rentalRepo.findOverdue();
    if (overdueRentals.length === 0) {
      throw new Error("No overdue rentals found");
    }
    
    return overdueRentals;
  }

  async extendRental(rentalId: string, extraDays: number): Promise<Rental> {
    const rental = await this.rentalRepo.findById(rentalId);
    if (!rental) {
      throw new Error("Rental does not exist");
    }
    // Add extraDays to return_date
    rental.return_date.setDate(rental.return_date.getDate() + extraDays);
    // Update the rental (rentalRepo.update)
    await this.rentalRepo.update(rental);
    return rental;
  }

  async calculateLateFee(rentalId: string): Promise<number> {
    const rental = await this.rentalRepo.findById(rentalId);
    if (!rental) {
      throw new Error("Rental does not exist");
    }
    // Find the associated film via inventory_id to get rental_rate
    const inventory = await this.inventoryRepo.findById(rental.inventory_id);
    if (!inventory) {
      throw new Error("Inventory does not exist");
    }

    const film = await this.filmRepo.findById(inventory.film_id);
    if (!film) {
      throw new Error("Film does not exist");
    }
    // Calculate overdue days (difference between NOW and return_date)
    const now = new Date();
    if (now > rental.return_date) {
      const diffTime = Math.abs(now.getTime() - rental.return_date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // Calculate late fee: rental_rate * late_fee_factor (e.g.: 1.5)
      const lateFee = diffDays * (film.rental_rate || 0) * 1.5;
      return lateFee;
    } else {
      // If there is no delay, return 0
      return 0;
    }
    
  }

  async hasUnpaidOverdueRentals(customerId: string): Promise<boolean> {
    // Check if customer has overdue rentals without payment
    const rentals = await this.rentalRepo.findByCustomer(customerId);
    
    // Check if there are overdue rentals (return_date < NOW)
    const now = new Date();
    const overdueRentals = rentals.filter(rental => rental.return_date < now);
    
    // If there are no overdue rentals, there are no debts
    if (overdueRentals.length === 0) {
      return false;
    }
    
    // For each overdue rental, check if there is a corresponding payment
    const payments = await this.paymentRepo.findByCustomer(customerId);
    
    // If there are overdue rentals without payment, return true
    for (const rental of overdueRentals) {
      const hasPayment = payments.some(payment => payment.rental_id === rental.id);
      if (!hasPayment) {
        return true; // Overdue rental without payment = pending debt
      }
    }
    
    // All overdue rentals have payment
    return false;
  }
}
