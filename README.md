# 🎬 DVD Rental API

A robust RESTful API built with Node.js, TypeScript, and PostgreSQL for managing a DVD rental store. This system handles customer management, staff operations, rental transactions, and payment processing with a clean architecture and type-safe implementation.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## ✨ Features

- **Customer Management**: Register customers, view profiles, rental and payment history
- **Staff Operations**: Manage staff members and their activities
- **Rental System**: Handle DVD rentals with inventory tracking
- **Payment Processing**: Process and track rental payments
- **Type-Safe**: Full TypeScript implementation with Zod validation
- **Database Migrations**: Automated migrations with Umzug
- **Security**: Password hashing with bcrypt
- **Docker Support**: Containerized PostgreSQL database

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express 5
- **Database**: PostgreSQL 15
- **ORM/Query Builder**: Node-Postgres (pg)
- **Validation**: Zod
- **Migrations**: Umzug
- **Security**: Bcrypt
- **Dev Tools**: Nodemon, ts-node, tsconfig-paths
- **Containerization**: Docker Compose

## 🏗️ Architecture

This project follows a layered architecture pattern:

```
Controllers → Services → Repositories → Database
```

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Manage data access and database operations
- **Entities**: Define data models
- **DTOs**: Data Transfer Objects for validation
- **Migrations**: Database schema versioning

## 🎯 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dvd-rental-api.git
   cd dvd-rental-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=db_port
   DB_USER=db_username
   DB_PASSWORD=db_password
   DB_NAME=db_name
   ```

4. **Start the PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run migration:up
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 🗄️ Database Setup

The project uses Docker Compose to run PostgreSQL. The database configuration is in `docker-compose.yml`:

- **Container Name**: my_postgres_db
- **Port**: 5433 (mapped to 5432 inside container)
- **Database**: dvd_rental_db
- **User**: diogo
- **Password**: 123456

### Migration Commands

```bash
# Run all pending migrations
npm run migration:up

# Rollback all migrations
npm run migration:down

# Create a new migration
npm run migration:create -- YourMigrationName
```

## 📡 API Endpoints

### Customers

- `POST /api/customers` - Register a new customer
- `GET /api/customers/:customerId/profile` - Get customer profile
- `GET /api/customers/:customerId/rentals` - Get rental history
- `GET /api/customers/:customerId/payments` - Get payment history
- `PUT /api/customers/:customerId` - Update customer information

### Staff

- `POST /api/staff` - Register a new staff member
- `GET /api/staff/:staffId` - Get staff details
- `PUT /api/staff/:staffId` - Update staff information
- `DELETE /api/staff/:staffId` - Remove staff member

### Rentals

- `POST /api/rentals` - Create a new rental
- `GET /api/rentals/:rentalId` - Get rental details
- `PUT /api/rentals/:rentalId/return` - Process rental return
- `GET /api/rentals/overdue` - Get overdue rentals

### Payments

- `POST /api/payments` - Process a payment
- `GET /api/payments/:paymentId` - Get payment details
- `GET /api/payments/customer/:customerId` - Get customer payments

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   ├── db/             # Database connection (client & pool)
│   └── umzug/          # Migration configuration
├── controllers/        # Request handlers
├── services/           # Business logic layer
├── repositories/       # Data access layer
├── entities/           # Database entities/models
├── dto/                # Data Transfer Objects
├── routes/             # API route definitions
├── migrations/         # Database migrations
└── main.ts            # Application entry point
```

## 📜 Scripts

```bash
# Development
npm run dev              # Start development server with hot-reload

# Migrations
npm run migration        # Run migration CLI
npm run migration:up     # Run all pending migrations
npm run migration:down   # Rollback all migrations
npm run migration:create # Create a new migration file

# Testing
npm test                # Run tests (not yet implemented)
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5433 |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |

## 🗃️ Database Schema

The system includes the following entities:

- actor – stores actor data including first name and last name.
- film – stores film data such as title, release year, length, rating, etc.
- film_actor – stores the relationships between films and actors.
- category – stores film’s categories data.
- film_category- stores the relationships between films and categories.
- store – contains the store data including manager staff and address.
- inventory – stores inventory data.
- rental – stores rental data.
- payment – stores customer’s payments.
- staff – stores staff data.
- customer – stores customer data.
- address – stores address data for staff and customers
- city – stores city names.
- country – stores country names.

Below, you can see the crow's foot database diagram of this application:

<table align="center">
  <td align="center">
    <img src="/ERD.dvd.png" alt="ERD" width="600" />
  </td>
</table>

## 🛠️ Development

### Code Style

- Follow TypeScript best practices
- Use async/await for asynchronous operations

### Adding New Features

1. Create entity models in `src/entities/`
2. Add repository in `src/repositories/`
3. Implement service logic in `src/services/`
4. Create controller in `src/controllers/`
5. Define routes in `src/routes/`
6. Create migration if database changes are needed
