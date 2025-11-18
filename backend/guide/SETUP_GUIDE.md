# GegoK12 ERP Backend - Setup Guide

## 📋 Prerequisites

- Node.js (v18.x or higher recommended)
- MongoDB Atlas account or local MongoDB
- Redis (optional - for caching and queues)
- Gmail account (for email notifications)
- Twilio account (optional - for SMS)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

### 3. Update .env File

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
FRONTEND_URL=http://localhost:3001

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRATION=30d

# Email (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_FROM_NAME=GegoK12 ERP
MAIL_FROM_ADDRESS=noreply@gegok12.com

# SMS (Twilio) - Optional
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Redis - Optional
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
CACHE_TTL=300

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

### 4. Run Development Server

```bash
npm run start:dev
```

### 5. Access Application

- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1/health

---

## 📧 Email Configuration (Gmail)

### Enable Gmail App Password

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Go to Security > App Passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Update `MAIL_PASSWORD` in `.env`

### Test Email

```bash
curl -X POST http://localhost:3000/api/v1/test/email \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test", "text": "Hello"}'
```

---

## 📱 SMS Configuration (Twilio)

### Setup Twilio Account

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Get a Twilio phone number
4. Update credentials in `.env`

### Test SMS

```bash
curl -X POST http://localhost:3000/api/v1/test/sms \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "message": "Test SMS"}'
```

---

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Add database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string
6. Update `MONGODB_URI` in `.env`

### Option 2: Local MongoDB

```bash
# Install MongoDB locally
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: apt-get install mongodb

# Start MongoDB
mongod --dbpath /path/to/data

# Update .env
MONGODB_URI=mongodb://localhost:27017/school_erp
```

---

## 🔴 Redis Setup (Optional)

### Windows

```bash
# Download Redis from: https://github.com/microsoftarchive/redis/releases
# Or use Docker:
docker run -d -p 6379:6379 redis:alpine
```

### Mac

```bash
brew install redis
redis-server
```

### Linux

```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### Verify Redis

```bash
redis-cli ping
# Should return: PONG
```

**Note:** Redis is optional. If not configured, caching and queue features will be disabled.

---

## 🧪 Testing

### Run Unit Tests

```bash
npm run test
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

---

## 🔧 Development Commands

```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Lint code
npm run lint

# Format code
npm run format

# Generate module
nest g module modules/module-name

# Generate controller
nest g controller modules/module-name

# Generate service
nest g service modules/module-name
```

---

## 📚 API Documentation

### Swagger UI

Visit http://localhost:3000/api/docs

Features:
- Interactive API testing
- Request/response schemas
- JWT authentication support
- Try it out functionality

### Authentication

1. Register a user:
```bash
POST /api/v1/auth/register
{
  "name": "Admin User",
  "email": "admin@school.com",
  "password": "password123",
  "role": "admin"
}
```

2. Login:
```bash
POST /api/v1/auth/login
{
  "email": "admin@school.com",
  "password": "password123"
}
```

3. Copy the `access_token` from response

4. In Swagger, click "Authorize" button and paste token

---

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── filters/         # Exception filters
│   │   ├── guards/          # Auth guards
│   │   └── interceptors/    # Response interceptors
│   ├── config/              # Configuration files
│   │   └── winston.config.ts
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── users/           # User management
│   │   ├── schools/         # School management
│   │   ├── students/        # Student management
│   │   ├── teachers/        # Teacher management
│   │   ├── attendance/      # Attendance tracking
│   │   ├── exams/           # Exam management
│   │   ├── assignments/     # Assignments
│   │   ├── homework/        # Homework
│   │   ├── lesson-plans/    # Lesson planning
│   │   ├── timetable/       # Class schedules
│   │   ├── fees/            # Fee management
│   │   ├── library/         # Library
│   │   ├── transport/       # Transport
│   │   ├── communication/   # Notices
│   │   ├── events/          # Events
│   │   ├── leaves/          # Leave management
│   │   ├── payroll/         # Payroll
│   │   ├── notifications/   # Email, SMS, WebSocket
│   │   ├── reports/         # PDF, Excel reports
│   │   ├── cache/           # Redis caching
│   │   ├── queues/          # Bull job queues
│   │   └── activity-log/    # Activity logging
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry
├── uploads/                 # Uploaded files
│   ├── pdfs/               # Generated PDFs
│   └── excel/              # Excel files
├── logs/                    # Application logs
│   ├── application-*.log
│   ├── error-*.log
│   └── api/
├── .env                     # Environment variables
├── .env.example            # Environment template
├── nest-cli.json           # NestJS CLI config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

---

## 🔒 Security Best Practices

### Production Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB authentication
- [ ] Restrict CORS origins
- [ ] Enable rate limiting
- [ ] Use HTTPS in production
- [ ] Disable Swagger in production (optional)
- [ ] Enable Redis password
- [ ] Use environment-specific configs
- [ ] Regular security updates
- [ ] Enable MongoDB IP whitelist
- [ ] Use strong bcrypt rounds (10-12)

### Environment Variables

Never commit `.env` file to git. Use `.env.example` as template.

---

## 📊 Monitoring & Logs

### Log Files Location

```
logs/
├── application-2025-11-12.log  # All logs
├── error-2025-11-12.log        # Error logs only
├── exceptions-2025-11-12.log   # Exceptions
├── rejections-2025-11-12.log   # Promise rejections
└── api/
    └── api-2025-11-12.log      # API request logs
```

### Log Rotation

- Daily rotation
- Gzip compression after rotation
- Retention: 7-30 days based on log type
- Max file size: 20MB

### Activity Logs

View user activity:
```bash
GET /api/v1/activity-logs/my-activity
```

View school activity (admin only):
```bash
GET /api/v1/activity-logs/school
```

---

## 🚀 Production Deployment

### Build

```bash
npm run build
```

### Start

```bash
npm run start:prod
```

### PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/main.js --name gegok12-backend

# Monitor
pm2 monit

# Logs
pm2 logs

# Restart
pm2 restart gegok12-backend

# Stop
pm2 stop gegok12-backend
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

```
Error: MongooseServerSelectionError
```

**Solution:**
- Check MongoDB URI in `.env`
- Verify network access in MongoDB Atlas
- Check if MongoDB service is running

### Redis Connection Failed

```
Error: Redis connection failed
```

**Solution:**
- Redis is optional, app will work without it
- Check if Redis is running: `redis-cli ping`
- Verify REDIS_HOST and REDIS_PORT in `.env`

### Email Not Sending

```
Error: Invalid login
```

**Solution:**
- Enable 2FA on Gmail
- Generate app-specific password
- Update MAIL_PASSWORD with app password
- Check if less secure apps is enabled

### Port Already in Use

```
Error: EADDRINUSE
```

**Solution:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

---

## 📞 Support

For issues or questions:
- Check documentation in `/docs`
- Review Swagger API docs
- Check error logs in `/logs`
- Review FEATURES.md for feature list

---

## 📝 License

Proprietary - GegoK12 School Management System
