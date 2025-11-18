# GegoK12 ERP Backend - NestJS with MongoDB

Backend API for GegoK12 School Management System built with NestJS and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- MongoDB (Local or Atlas Cluster)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update MongoDB URI in .env file
MONGODB_URI=your_mongodb_cluster_uri_here
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

### API Endpoints

Base URL: `http://localhost:3000/api/v1`

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user (requires JWT)
- `POST /auth/logout` - Logout
- `POST /auth/password/change` - Change password
- `POST /auth/refresh-token` - Refresh JWT token

#### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PUT /users/:id/profile` - Update user profile

#### Schools
- `GET /schools` - List all schools
- `GET /schools/:id` - Get school by ID

#### Academic Years
- `GET /academic-years` - List academic years
- `GET /academic-years/current` - Get current academic year

### Testing the API

#### Register a new user:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@gegok12.com",
    "password": "Password123!",
    "school_id": "674d1234567890abcdef1234",
    "usergroup_id": "admin",
    "mobile_no": "1234567890"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gegok12.com",
    "password": "Password123!"
  }'
```

#### Get current user (with JWT token):
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── common/                 # Shared utilities
│   │   ├── decorators/         # Custom decorators
│   │   └── guards/             # Auth guards
│   └── modules/                # Feature modules
│       ├── auth/               # Authentication module
│       ├── users/              # Users module
│       ├── schools/            # Schools module
│       ├── academic/           # Academic years module
│       └── students/           # Students module
├── .env                        # Environment variables
├── tsconfig.json              # TypeScript configuration
├── nest-cli.json              # NestJS CLI configuration
└── package.json               # Dependencies
```

## 🗄️ MongoDB Schema

### Users Collection
- Multi-tenant (school_id)
- Role-based access control
- Soft deletes
- Profile relationship

### Schools Collection
- School information
- Logo and branding
- Contact details

### Academic Years Collection
- School-specific
- Current year tracking
- Date ranges

## 🔐 Authentication

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Token expiration: 7 days

## 🛠️ Development

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Testing
```bash
npm run test
npm run test:watch
npm run test:cov
```

## 📝 Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Application port (default: 3000)

## 📦 Next Steps

1. Update MongoDB URI in `.env` file
2. Create sample schools and users
3. Implement remaining modules (Students, Teachers, Attendance, etc.)
4. Add Swagger documentation
5. Implement WebSocket for real-time features

## 🤝 Contributing

This is a migration from Laravel to NestJS. Follow NestJS best practices and MongoDB patterns.

## 📄 License

MIT License
