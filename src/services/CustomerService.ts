import { Pool } from "pg";
import { CustomerRepo } from "@/repositories/CustomerRepo";
import { RentalRepo } from "@/repositories/RentalRepo";
import { PaymentRepo } from "@/repositories/PaymentRepo";
import { AddressRepo } from "@/repositories/AddressRepo";
import { Customer } from "@/entities/Customer";
import { Rental } from "@/entities/Rental";
import { Payment } from "@/entities/Payment";

interface CustomerProfile {
  customer: Customer;
  activeRentals: number;
  totalRentals: number;
  totalSpent: number;
}

interface CustomerRecord {
  firstName?: string;
  lastName?: string;
  email?: string;
  addressId?: string;
}

export class CustomerService {
  private customerRepo: CustomerRepo;
  private rentalRepo: RentalRepo;
  private paymentRepo: PaymentRepo;
  private addressRepo: AddressRepo;

  constructor(pool: Pool) {
    this.customerRepo = new CustomerRepo(pool);
    this.rentalRepo = new RentalRepo(pool);
    this.paymentRepo = new PaymentRepo(pool);
    this.addressRepo = new AddressRepo(pool);
  }

  async registerCustomer(
    firstName: string,
    lastName: string,
    email: string,
    addressId: string,
    storeId: string
  ): Promise<Customer> {
    // Register new customer
    const existingCustomer = await this.customerRepo.findByEmail(email);
    if (existingCustomer) {
      throw new Error("Email is already registered");
    }
    
    const address = await this.addressRepo.findById(addressId);
    if (!address) {
      throw new Error("Address not found");
    }
  
    const customer = new Customer(
      firstName,
      lastName,
      email,
      addressId,
      storeId
    );
    const createdCustomer = await this.customerRepo.create(customer);
    
    return createdCustomer;
  }

  async getCustomerProfile(customerId: string): Promise<CustomerProfile> {
    // Fetch complete customer profile
    // 1. Find the customer (customerRepo.findById)
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    // 2. Find all customer rentals (rentalRepo.findByCustomer)
    const rentals = await this.rentalRepo.findByCustomer(customerId);
    // 3. Count how many rentals are active (return_date > NOW)
    const now = new Date();
    const activeRentals = rentals.filter(rental => rental.return_date > now).length;
    // 4. Get total spent (paymentRepo.getTotalByCustomer)
    const totalSpent = await this.paymentRepo.getTotalByCustomer(customerId);
    // 5. Return object with all information
    return {
      customer,
      activeRentals,
      totalRentals: rentals.length,
      totalSpent,
    }
  }

  async getRentalHistory(customerId: string): Promise<Rental[]> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
  
    const rentals = await this.rentalRepo.findByCustomer(customerId);
    if (rentals.length === 0) {
      throw new Error("No rentals found for this customer");
    }
   
    return rentals;
  }

  async getPaymentHistory(customerId: string): Promise<Payment[]> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const payments = await this.paymentRepo.findByCustomer(customerId);
    if (payments.length === 0) {
      throw new Error("No payments found for this customer");
    }

    return payments;
  }

  async deactivateCustomer(customerId: string): Promise<Customer> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    // Check if there are active rentals (rentalRepo.findByCustomer and filter active ones)
    const rentals = await this.rentalRepo.findByCustomer(customerId);
    const now = new Date();
    const activeRentals = rentals.filter(rental => rental.return_date > now);
    // If there are active rentals, throw error (customer has pending items)
    if (activeRentals.length > 0) {
      throw new Error("Customer has active rentals and cannot be deactivated");
    }
    
    customer.active = false;
    const updatedCustomer = await this.customerRepo.update(customer);
    if (!updatedCustomer) {
      throw new Error("Failed to deactivate customer");
    }
    
    return updatedCustomer;
  }

  async activateCustomer(customerId: string): Promise<Customer> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
   
    customer.active = true;
    const updatedCustomer = await this.customerRepo.update(customer);
    if (!updatedCustomer) {
      throw new Error("Failed to activate customer");
    }
   
    return updatedCustomer;
  }

  async updateCustomerInfo(
    customerId: string,
    customerRecord: CustomerRecord
  ): Promise<Customer> {
    // TODO: Update customer information
    // 1. Find the customer (customerRepo.findById)
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    // 2. If email was changed, check if it's not already in use by another customer
    if (customerRecord.email && customerRecord.email !== customer.email) {
      const existingCustomer = await this.customerRepo.findByEmail(customerRecord.email);
      if (existingCustomer && existingCustomer.id !== customerId) {
        throw new Error("Email is already in use by another customer");
      }
    }
    // 3. Update the provided fields
    if (customerRecord.firstName !== undefined) {
      customer.first_name = customerRecord.firstName;
    }
    if (customerRecord.lastName !== undefined) {
      customer.last_name = customerRecord.lastName;
    }
    if (customerRecord.email !== undefined) {
      customer.email = customerRecord.email;
    }
    if (customerRecord.addressId !== undefined) {
      customer.address_id = customerRecord.addressId;
    }
    // 4. Save (customerRepo.update)
    const updatedCustomer = await this.customerRepo.update(customer);
    if (!updatedCustomer) {
      throw new Error("Failed to update customer");
    }
    // 5. Return the updated customer
    return updatedCustomer;
  }

}
