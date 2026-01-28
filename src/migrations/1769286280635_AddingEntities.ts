import { transaction } from "../config/umzug/transaction";
import { Client } from "pg";

export const up = transaction(async (client: Client) => {

  await client.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `)

  await client.query(`
    
    CREATE TABLE film (
      id uuid DEFAULT gen_random_uuid(),
      title varchar(255) NOT NULL,
      description text,
      release_year int,
      rental_duration int NOT NULL,
      rental_rate numeric(4,2),
      length int,
      replacement_cost numeric(5,2) NOT NULL,
      rating varchar(10),
      fulltext tsvector,
      CONSTRAINT pk_film PRIMARY KEY (id)
    );

    CREATE TABLE category (
      id uuid DEFAULT gen_random_uuid(),
      name varchar(100) NOT NULL,
      CONSTRAINT pk_category PRIMARY KEY (id)
    );

    CREATE TABLE film_category (
      film_id uuid NOT NULL,
      category_id uuid NOT NULL
    );

    CREATE TABLE actor (
      id uuid DEFAULT gen_random_uuid(),
      first_name varchar(100) NOT NULL,
      last_name varchar(100) NOT NULL,
      CONSTRAINT pk_actor PRIMARY KEY (id)
    );

    CREATE TABLE film_actor (
      film_id uuid NOT NULL,
      actor_id uuid NOT NULL
    );

    CREATE TABLE country (
      id uuid DEFAULT gen_random_uuid(),
      name varchar(100) NOT NULL,
      CONSTRAINT pk_country PRIMARY KEY (id)
    );

    CREATE TABLE city (
      id uuid DEFAULT gen_random_uuid(),
      city varchar(255) NOT NULL,
      country_id uuid NOT NULL,
      CONSTRAINT pk_city PRIMARY KEY (id),
      CONSTRAINT fk_country FOREIGN KEY (country_id) REFERENCES country(id)
    );

    CREATE TABLE address (
      id uuid DEFAULT gen_random_uuid(),
      address varchar(255) NOT NULL,
      address2 varchar(255),
      district varchar(100) NOT NULL,
      city_id uuid NOT NULL,
      postal_code varchar(20),
      phone varchar(20) NOT NULL,
      CONSTRAINT pk_address PRIMARY KEY (id),
      CONSTRAINT fk_city FOREIGN KEY (city_id) REFERENCES city(id)
    );

    CREATE TABLE store (
      id uuid DEFAULT gen_random_uuid(),
      address_id uuid NOT NULL,
      CONSTRAINT pk_store PRIMARY KEY (id),
      CONSTRAINT fk_address FOREIGN KEY (address_id) REFERENCES address(id)
    );

    CREATE TABLE staff (
      id uuid DEFAULT gen_random_uuid(),
      first_name varchar(100) NOT NULL,
      last_name varchar(100) NOT NULL,
      email varchar(255) UNIQUE NOT NULL,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      active boolean DEFAULT true,
      address_id uuid,
      store_id uuid,
      CONSTRAINT pk_staff PRIMARY KEY (id),
      CONSTRAINT fk_address FOREIGN KEY (address_id) REFERENCES address(id),
      CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES store(id)
    );

    ALTER TABLE store ADD COLUMN manager_staff_id uuid;
    ALTER TABLE store ADD CONSTRAINT fk_manager_staff FOREIGN KEY (manager_staff_id) REFERENCES staff(id);

    CREATE TABLE customer (
      id uuid DEFAULT gen_random_uuid(),
      first_name varchar(100) NOT NULL,
      last_name varchar(100) NOT NULL,
      email varchar(255) UNIQUE NOT NULL,
      created_at timestamptz DEFAULT now(),
      address_id uuid,
      store_id uuid,
      active boolean DEFAULT true,
      CONSTRAINT pk_customer PRIMARY KEY (id),
      CONSTRAINT fk_address FOREIGN KEY (address_id) REFERENCES address(id),
      CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES store(id)
    );

    CREATE TABLE inventory (
      id uuid DEFAULT gen_random_uuid(),
      film_id uuid NOT NULL,
      store_id uuid NOT NULL,
      CONSTRAINT pk_inventory PRIMARY KEY (id),
      CONSTRAINT fk_film FOREIGN KEY (film_id) REFERENCES film(id),
      CONSTRAINT fk_store FOREIGN KEY (store_id) REFERENCES store(id)
    );

    CREATE TABLE rental (
      id uuid DEFAULT gen_random_uuid(),
      rental_date timestamptz NOT NULL,
      return_date timestamptz NOT NULL,
      inventory_id uuid NOT NULL,
      customer_id uuid NOT NULL,
      staff_id uuid NOT NULL,
      CONSTRAINT pk_rental PRIMARY KEY (id),
      CONSTRAINT fk_inventory FOREIGN KEY (inventory_id) REFERENCES inventory(id),
      CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customer(id),
      CONSTRAINT fk_staff FOREIGN KEY (staff_id) REFERENCES staff(id)
    );

    CREATE TABLE payment (
      id uuid DEFAULT gen_random_uuid(),
      amount numeric(10, 2) NOT NULL,
      payment_date timestamptz NOT NULL,
      rental_id uuid NOT NULL,
      customer_id uuid NOT NULL,
      staff_id uuid NOT NULL,
      CONSTRAINT pk_payment PRIMARY KEY (id),
      CONSTRAINT fk_rental FOREIGN KEY (rental_id) REFERENCES rental(id),
      CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customer(id),
      CONSTRAINT fk_staff FOREIGN KEY (staff_id) REFERENCES staff(id)
    );

    `)
});

export const down = transaction(async (client: Client) => {
  await client.query(`
    -- Drop tables in reverse order of creation
    DROP TABLE IF EXISTS payment CASCADE;
    DROP TABLE IF EXISTS rental CASCADE;
    DROP TABLE IF EXISTS inventory CASCADE;
    DROP TABLE IF EXISTS customer CASCADE;
    
    -- Drop the foreign key constraint before dropping staff
    ALTER TABLE store DROP CONSTRAINT IF EXISTS fk_manager_staff;
    ALTER TABLE store DROP COLUMN IF EXISTS manager_staff_id;
    
    DROP TABLE IF EXISTS staff CASCADE;
    DROP TABLE IF EXISTS store CASCADE;
    DROP TABLE IF EXISTS address CASCADE;
    DROP TABLE IF EXISTS city CASCADE;
    DROP TABLE IF EXISTS country CASCADE;
    DROP TABLE IF EXISTS film_actor CASCADE;
    DROP TABLE IF EXISTS actor CASCADE;
    DROP TABLE IF EXISTS film_category CASCADE;
    DROP TABLE IF EXISTS category CASCADE;
    DROP TABLE IF EXISTS film CASCADE;
    
    DROP EXTENSION IF EXISTS "pgcrypto";
  `)
});