# Almatar Loyality System
A secure backend service for transferring points between users with expiration logic, built with Node.js, Prisma, SQL Server, and BullMQ.
## Table of Contents
- [Features](#-Features)
- [Tech Stack](#Tech-Stack)
- [Setup](#Setup)
- [Project Structure](#Project-Structure)
- [View Postman Collection](#view-postman-collection)
- [Thank You](#thank-you)

## Features
- JWT-based authentication with secure password hashing (bcrypt)
- Email normalization to prevent duplicate accounts (Test@Gmail.com == test@gmail.com)
- Secure points transfer between users
- Transactions expire automatically after 10 minutes (BullMQ + Redis)
- Safe concurrency with Prisma transactions (prevents race conditions)
- Background jobs with BullMQ & Redis
- Database layer with Prisma ORM + SQL Server
- Centralized error handling and validation middlewares
- Includes request validation with Joi


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
   ```bash
    Create a .env file in the root directory:
    DATABASE_URL="sqlserver://localhost:1433;database=db_name;user=Your_username;password=Your_password;encrypt=true;trustServerCertificate=true"
    PORT=Your Port
    JWT_SECRET_KEY=your-very-strong-secret
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
   ```
5. **Run database migrations (Prisma)**
    npx prisma migrate dev
6. **Start Redis server**
    redis-server (Run this command in the directory where Redis is installed on your device)
7. **Run background worker**
    npm run worker
8. **Start the application**    
    Development: `npm run dev`
    Production: `npm run start`

## Project Structure

```bash
src/
├── controllers/   # Business Logic
├── jobs/          # Expire Transaction
├── middlewares/   # Validation, Async Wrapper, Verify Token
├── routes/        # Route Definitions
├── utils/         # Helper functions and Error Handling
├── workers/       # BullMQ Workers
└── prisma/        # Prisma Schema & Migrations
```
## View Postman Collection
    (https://documenter.getpostman.com/view/35041186/2sB3QCTEHZ)

## Thank You

II would like to thank you for the professional recruitment process, including the technical interview that I was glad to successfully pass.  
I truly enjoyed working on this task and learned a lot throughout the process.  

It would be an honor to work with such an amazing team, and I’m excited about the possibility of contributing my skills and growing further with you. 🚀
