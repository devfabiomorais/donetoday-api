# DoneToday API

REST API for the DoneToday workout tracking app. Built with Node.js, TypeScript, Express and Prisma 7, connected to a PostgreSQL database on Supabase.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js 5
- **ORM:** Prisma 7.7.0
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT + bcrypt
- **Validation:** Zod
- **Email:** Resend
- **Documentation:** Swagger UI

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/devfabiomorais/donetoday-api.git
cd donetoday-api
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_jwt_secret"
RESEND_API_KEY="your_resend_api_key"
RESEND_FROM_EMAIL="onboarding@resend.dev"
APP_URL="http://localhost:3000"
```

### Running the project

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## API Documentation

Swagger UI available at:

```
http://localhost:3000/docs
```

## Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register a new user | ❌ |
| POST | /auth/login | Login | ❌ |
| POST | /auth/forgot-password | Request password reset email | ❌ |
| POST | /auth/reset-password | Reset password with token | ❌ |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /users/me | Get current user profile | ✅ |
| PUT | /users/me | Update current user profile | ✅ |
| DELETE | /users/me | Delete current user account | ✅ |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /admin/users | List all users | ✅ ADMIN |
| GET | /admin/users/:id | Get user by ID | ✅ ADMIN |
| PUT | /admin/users/:id | Update user by ID | ✅ ADMIN |
| DELETE | /admin/users/:id | Delete user by ID | ✅ ADMIN |

## Project Structure

```
src/
├── generated/prisma/     # Prisma Client (auto-generated)
├── lib/
│   ├── prisma.ts         # Prisma Client instance
│   ├── email.ts          # Email service (Resend)
│   ├── env.ts            # Environment variables validation
│   └── swagger.ts        # Swagger documentation
├── middlewares/
│   ├── errorHandler.ts   # Global error handler
│   ├── validate.ts       # Zod validation middleware
│   ├── authenticate.ts   # JWT authentication middleware
│   └── authorize.ts      # Role-based authorization middleware
├── modules/
│   ├── auth/             # Authentication module
│   ├── users/            # User profile module
│   └── admin/            # Admin panel module
├── app.ts                # Express app configuration
└── server.ts             # Server entry point
```

## Database Migrations

> ⚠️ Before running migrations, temporarily switch `DATABASE_URL` to the direct connection (port 5432). After the migration, switch back to the pooler (port 6543).

```bash
# Run migrations
npx prisma migrate dev --name migration_name

# Generate Prisma Client
npx prisma generate
```