# Almatar Loyality System
A secure backend service for transferring points between users with expiration logic, built with Node.js, Prisma, SQL Server, and BullMQ.
## Table of Contents
- [Features](#-Features)
- [Tech Stack](#Tech-Stack)
- [Setup](#Setup)
- [API Endpoints](#API-Endpoints)
- [Project Structure](#Project-Structure)

## Features
- JWT-based authentication with secure password hashing (bcrypt)
- Email normalization to prevent duplicate accounts (Test@Gmail.com == test@gmail.com)
- Secure points transfer between users
- Transactions expire automatically after 10 minutes (BullMQ + Redis)
- Safe concurrency with Prisma transactions (prevents race conditions)
- Background jobs with BullMQ & Redis
- Database layer with Prisma ORM + SQL Server
- Centralized error handling and validation middlewares
- Includes request validation with Joi/Zod


## Tech Stack
- **Backend**: Node.js, Express
- **Database**: SQL Server (Prisma ORM) 
- **Queue**: BullMQ + Redis
- **Auth**: JWT

## Setup
1. **Clone repository**
   ```bash
   git clone https://github.com/Joe-Khaled/AlmatarLoyality.git
   cd AlmatarLoyality
2. **Install dependencies**
    npm install
3. **Configure environment variables**
    Create a .env file in the root directory:
    DATABASE_URL="sqlserver://localhost:1433;database=db_name;user=Your_username;password=Your_password;encrypt=true;trustServerCertificate=true"
    PORT=Your Port
    JWT_SECRET_KEY=your-very-strong-secret
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
4. **Run database migrations (Prisma)**
    npx prisma migrate dev
5. **Start Redis server**
    redis-server
6. **Run background worker**
    npm run worker
7. **Start the application**    
    Development: `npm run dev`
    Production: `npm run start`

## API Endpoints

### Auth
- `POST /api/auth/user` – Register user
- `POST /api/auth/user/login` – Login
- `GET  /api/user/points` - Retrieve User Points

### Transactions
- `POST /api/transactions` – Create New Transfer
- `POST /api/transactions/confirm/:id` – Confirm Transfer
- `GET /api/transactions` - List All Transactions
- `GET /api/transactions/user` - List Transactions For Single User

## Project Structure
src/
 ├── controllers/    # Business Logic
 ├── jobs/           # Expire Transaction   
 ├── middlewares/    # Validation, Async Wrapper, Validation , Verify Token
 ├── routes/         # Route Definitions
 ├── utils/          # Helper functions And Error Handling
 ├── workers/        # BullMQ Workers
 └── prisma/         # Prisma Schema & Migrations

