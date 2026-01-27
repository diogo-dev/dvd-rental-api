import { Pool } from "pg";
import { PaymentRepo } from "@/repositories/PaymentRepo";
import { RentalRepo } from "@/repositories/RentalRepo";
import { CustomerRepo } from "@/repositories/CustomerRepo";
import { FilmRepo } from "@/repositories/FilmRepo";
import { InventoryRepo } from "@/repositories/InventoryRepo";
import { Payment } from "@/entities/Payment";
import { Rental } from "@/entities/Rental";
import { RentalService } from "./RentalService";

export class PaymentService {
  private paymentRepo: PaymentRepo;
  private rentalRepo: RentalRepo;
  private rentalService: RentalService;
  private customerRepo: CustomerRepo;
  private filmRepo: FilmRepo;
  private inventoryRepo: InventoryRepo;

  constructor(pool: Pool) {
    this.paymentRepo = new PaymentRepo(pool);
    this.rentalRepo = new RentalRepo(pool);
    this.customerRepo = new CustomerRepo(pool);
    this.filmRepo = new FilmRepo(pool);
    this.inventoryRepo = new InventoryRepo(pool);
    this.rentalService = new RentalService(pool);
  }

  async processRentalPayment(
    rentalId: string,
    customerId: string,
    staffId: string
  ): Promise<Payment> {
    // TODO: Process rental payment
    // 1. Find the rental (rentalRepo.findById)
    const rental = await this.rentalRepo.findById(rentalId);
    if (!rental) {
      throw new Error("Rental not found");
    }
    // 2. Find the inventory by rental.inventory_id (inventoryRepo.findById)
    const inventory = await this.inventoryRepo.findById(rental.inventory_id);
    if (!inventory) {
      throw new Error("Inventory not found");
    }
    // 3. Find the film by inventory.film_id (filmRepo.findById)
    const film = await this.filmRepo.findById(inventory.film_id);
    if (!film) {
      throw new Error("Film not found");
    }
    // 4. Calculate the amount: rental_duration * rental_rate of the film
    let amount = film.rental_rate || 0;

    // 5. Check if there is a late fee, if so, add it to the amount
    const paymentDate = new Date();
    if (rental.return_date < paymentDate) {
      const lateFee = await this.rentalService.calculateLateFee(rentalId);
      amount += lateFee;
    }

    // 6. Create the payment with amount, payment_date (now), rental_id, customer_id, staff_id
    const payment = new Payment(
      amount,
      paymentDate,
      rentalId,
      customerId,
      staffId
    );
    // 7. Save the payment (paymentRepo.create)
    const createdPayment = await this.paymentRepo.create(payment);
    // 8. Return the created payment
    return createdPayment;
  }

  async getPaymentsByCustomer(customerId: string): Promise<Payment[]> {
    // TODO: Fetch all payments from a customer
    // 1. Use paymentRepo.findByCustomer to fetch all payments
    // 2. Return the list of payments
    const payments = await this.paymentRepo.findByCustomer(customerId);
    if (payments.length === 0) {
      throw new Error("No payments found for this customer");
    }

    return payments;
  }

  async getTotalPaidByCustomer(customerId: string): Promise<number> {
    // TODO: Calculate total paid by a customer
    // 1. Use paymentRepo.getTotalByCustomer to sum all payments
    const total = await this.paymentRepo.getTotalByCustomer(customerId);
    if (total === 0) {
      throw new Error("This customer has not made any payments");
    }

    // 2. Return the total amount
    return total;
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    // TODO: Fetch payments in a period
    // 1. Use paymentRepo.findByDateRange to fetch payments between dates
    const payments = await this.paymentRepo.findByDateRange(startDate, endDate);
    if (payments.length === 0) {
      throw new Error("No payments found in the specified date range");
    }
    // 2. Return the list of payments
    return payments;
  }

  async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number> {
    // TODO: Calculate total revenue in a period
    // 1. Fetch payments in the period (paymentRepo.findByDateRange)
    const payments = await this.paymentRepo.findByDateRange(startDate, endDate);
    if (payments.length === 0) {
      throw new Error("No payments found in the specified date range");
    }
    // 2. Sum the amount of all payments
    let totalRevenue = 0;
    payments.forEach(payment => {
      totalRevenue += payment.amount;
    })
    // 3. Return the total amount
    return totalRevenue;
  }

  async getPaymentReceipt(paymentId: string): Promise<{
    payment: Payment;
    rental: Rental;
    customerName: string;
    filmTitle: string;
  }> {
    // TODO: Generate detailed payment receipt
    // 1. Find the payment (paymentRepo.findById)
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    // 2. Find the associated rental (rentalRepo.findById)
    const rental = await this.rentalRepo.findById(payment.rental_id);
    if (!rental) {
      throw new Error("Associated rental not found");
    }
    // 3. Find the customer (customerRepo.findById)
    const customer = await this.customerRepo.findById(payment.customer_id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    // 4. Find inventory and then film to get title
    const inventory = await this.inventoryRepo.findById(rental.inventory_id);
    if (!inventory) {
      throw new Error("Inventory not found");
    }
    const film = await this.filmRepo.findById(inventory.film_id);
    if (!film) {
      throw new Error("Film not found");
    }

    // 5. Return object with all information for the receipt
    return {
      customerName: `${customer.first_name} ${customer.last_name}`,
      filmTitle: film.title,
      payment,
      rental,
    }
  }
}
