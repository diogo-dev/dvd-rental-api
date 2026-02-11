import {seed} from './seed';
import pool from './pool_pg';

import { CustomerService } from '@/services/CustomerService';
import { PaymentService } from '@/services/PaymentService';
import { StaffService } from '@/services/StaffService';
import { RentalService } from '@/services/RentalService';

import { CountryRepo } from '@/repositories/CountryRepo';
import { CityRepo } from '@/repositories/CityRepo';
import { AddressRepo } from '@/repositories/AddressRepo';
import { StoreRepo } from '@/repositories/StoreRepo';
import { InventoryRepo } from '@/repositories/InventoryRepo';
import { FilmRepo } from '@/repositories/FilmRepo';
import { CategoryRepo } from '@/repositories/CategoryRepo';
import { ActorRepo } from '@/repositories/ActorRepo';

const runSeed = async () => {
  try {
    // create repositories instances
    const countryRepo = new CountryRepo(pool);  
    const cityRepo = new CityRepo(pool);
    const addressRepo = new AddressRepo(pool);
    const storeRepo = new StoreRepo(pool);
    const inventoryRepo = new InventoryRepo(pool);
    const filmRepo = new FilmRepo(pool);
    const categoryRepo = new CategoryRepo(pool);
    const actorRepo = new ActorRepo(pool);

    // create service instances
    const customerService = new CustomerService(pool);
    const paymentService = new PaymentService(pool);
    const staffService = new StaffService(pool);
    const rentalService = new RentalService(pool);

    // run seeds
    console.log("Starting database seeding...");
    await seed(
      customerService,
      paymentService,
      rentalService,
      staffService,
      countryRepo,
      cityRepo,
      addressRepo,
      storeRepo,
      inventoryRepo,
      filmRepo,
      categoryRepo,
      actorRepo
    );
    console.log("Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error running seed:", error);
    process.exit(1);
  } finally {
    // close database connection
    await pool.end();
  }
}

runSeed();