# Job Portal

A modern, scalable microservices-based job portal application built with NestJS, TypeScript, and PostgreSQL.

## 📋 Project Overview

Job Portal is a comprehensive platform that connects job seekers with employers. The application is structured as a microservices architecture with three independent services communicating with each other:

- **User Service**: Handles user authentication, registration, and user profile management
- **Job Service**: Manages job postings and job listings
- **Application Service**: Handles job applications submitted by users

All services are containerized using Docker and utilize PostgreSQL as the primary database.

## 🏗️ Architecture

The project follows a microservices architecture pattern:

```
┌─────────────────────────────────────────────────┐
│         Client Applications                     │
└────────┬──────────────┬───────────────┬─────────┘
         │              │               │
    ┌────▼────┐    ┌────▼────┐    ┌───▼──────┐
    │  User   │    │   Job   │    │Application│
    │ Service │    │ Service │    │ Service   │
    │ :3001   │    │ :3002   │    │ :3003     │
    └────┬────┘    └────┬────┘    └───┬──────┘
         │              │              │
         └──────────────┼──────────────┘
                        │
                    ┌───▼────────┐
                    │ PostgreSQL │
                    │  Database  │
                    └────────────┘
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Authentication**: JWT (Passport.js)
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest

## 📋 Prerequisites

### Option 1: Docker (Recommended)
- Docker Engine 20.10+
- Docker Compose 2.0+

### Option 2: Local Development
- Node.js 18.x or higher
- npm or yarn package manager
- PostgreSQL 15 (for local database)

## 🚀 Getting Started

### Option 1: Running with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Job-Portal
   ```

2. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build Docker images for all three services
   - Start PostgreSQL database
   - Initialize databases using `postgres-init/init.sql`
   - Start all three microservices
   - Set up networking between services

3. **Verify services are running**
   ```bash
   docker ps
   ```

4. **Access the services**
   - User Service: http://localhost:3001
   - Job Service: http://localhost:3002
   - Application Service: http://localhost:3003

5. **Stop services**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development Setup

#### 1. Install Dependencies

For each service, install dependencies:

```bash
# User Service
cd user-service
npm install
cd ..

# Job Service
cd job-service
npm install
cd ..

# Application Service
cd application-service
npm install
cd ..
```

#### 2. Database Setup

Ensure PostgreSQL is running and create the required databases:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create databases
CREATE DATABASE user_db;
CREATE DATABASE job_db;
CREATE DATABASE application_db;
```

Or run the init script:
```bash
psql -U postgres -d postgres -f postgres-init/init.sql
```

#### 3. Environment Configuration

Create `.env` files in each service directory (if needed) with the following variables:

**user-service/.env**
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=user_db
SECRET_KEY=your_secret_key
PORT=3001
```

**job-service/.env**
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=job_db
SECRET_KEY=your_secret_key
PORT=3002
```

**application-service/.env**
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=application_db
SECRET_KEY=your_secret_key
PORT=3003
JOB_SERVICE_HOST=localhost
```

#### 4. Start Services

Open separate terminal windows and run each service:

```bash
# Terminal 1 - User Service
cd user-service
npm run start:dev

# Terminal 2 - Job Service
cd job-service
npm run start:dev

# Terminal 3 - Application Service
cd application-service
npm run start:dev
```

## 📚 API Endpoints

### User Service (Port 3001)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `GET /users/:id` - Get user profile
- `PATCH /users/:id` - Update user profile

### Job Service (Port 3002)
- `GET /jobs` - Get all job postings
- `GET /jobs/:id` - Get specific job posting
- `POST /jobs` - Create new job posting (requires auth)
- `PATCH /jobs/:id` - Update job posting (requires auth)
- `DELETE /jobs/:id` - Delete job posting (requires auth)

### Application Service (Port 3003)
- `GET /applications` - Get all applications
- `GET /applications/:id` - Get specific application
- `POST /applications` - Submit new application (requires auth)
- `PATCH /applications/:id` - Update application status (requires auth)

## 📦 Available Scripts

Each service includes standard NestJS scripts:

```bash
npm run build          # Build the project
npm run start          # Start the application
npm run start:dev      # Start in development mode with auto-reload
npm run start:prod     # Start in production mode
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage report
npm run test:e2e       # Run end-to-end tests
npm run lint           # Run ESLint and fix issues
npm run format         # Format code with Prettier
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in via User Service
2. Receives JWT token in response
3. Includes token in `Authorization: Bearer <token>` header for protected endpoints
4. JWT is validated by each service's JWT Guard middleware

## 📂 Project Structure

```
Job-Portal/
├── user-service/           # User authentication and profile management
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/       # Authentication logic
│   │   │   └── users/      # User management
│   │   ├── common/         # Shared guards and strategies
│   │   └── main.ts         # Application entry point
│   └── package.json
├── job-service/            # Job posting management
│   ├── src/
│   │   ├── modules/
│   │   │   └── job/        # Job management logic
│   │   ├── common/         # Shared guards and strategies
│   │   └── main.ts         # Application entry point
│   └── package.json
├── application-service/    # Job application management
│   ├── src/
│   │   ├── modules/
│   │   │   └── applications/ # Application management logic
│   │   ├── common/         # Shared guards and strategies
│   │   └── main.ts         # Application entry point
│   └── package.json
├── postgres-init/          # Database initialization scripts
│   └── init.sql           # Database schema and seed data
└── docker-compose.yml      # Docker Compose configuration
```

## 🧪 Testing

Run tests for individual services:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

## 🐛 Troubleshooting

### Docker Issues

**Services won't start:**
```bash
# Check Docker daemon is running
docker ps

# View service logs
docker-compose logs <service-name>

# Rebuild images
docker-compose down
docker-compose up --build
```

**Port conflicts:**
- Ensure ports 3001, 3002, 3003, and 5432 are available
- Modify port mappings in `docker-compose.yml` if needed

### Local Development Issues

**Module not found errors:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Database connection errors:**
- Verify PostgreSQL is running
- Check database credentials in `.env` files
- Ensure databases exist or run initialization script

## 📝 License

This project is licensed under the UNLICENSED license.

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with descriptive messages
4. Push to the repository
5. Create a Pull Request

## 📞 Support

For issues and questions, please open an issue on the repository.
