# 🌍 International Payments Portal

A complete, production-ready MERN stack application for international payments processing with SWIFT integration.

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Customer/Employee)
- Input validation and sanitization
- Rate limiting and security headers
- XSS and NoSQL injection protection

### 👤 Customer Portal
- User registration and login
- Create international payments
- View transaction history
- Real-time payment status tracking
- Form validation with user-friendly error messages

### 👨‍💼 Employee Portal
- Dashboard with statistics
- View pending transactions
- Verify transactions
- Submit transactions to SWIFT
- Bulk transaction processing
- Transaction filtering and pagination

### 🏗️ Technical Features
- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **UI**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **API**: RESTful API with comprehensive error handling
- **Validation**: Client-side and server-side validation
- **Security**: Helmet, CORS, Rate limiting, Input sanitization

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/international-payments-portal.git
cd international-payments-portal
```

### 2. Install MongoDB
**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and choose "Complete" setup
3. Install MongoDB as a Windows Service
4. Start the MongoDB service:
   ```powershell
   net start MongoDB
   ```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 3. Backend Setup
```bash
cd server
npm install
```

Create environment file:
```bash
# server/.env
NODE_ENV=development
PORT=5000
DATABASE=mongodb://localhost:27017/international_payments
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Frontend Setup
```bash
cd client
npm install
```

### 5. Seed Database with Sample Data
```bash
cd server
npm run seed
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```
Backend will run on: http://localhost:5000

### Start Frontend Server
```bash
cd client
npm start
```
Frontend will run on: http://localhost:3000

## 🧪 Test Credentials

### Customer Accounts
- Username: `johnsmith` | Password: `Password123!`
- Username: `sarahj` | Password: `Password123!`
- Username: `michaelb` | Password: `Password123!`

### Employee Accounts
- Username: `admin` | Password: `Admin123!`
- Username: `officer` | Password: `Officer123!`

## 📁 Project Structure

```
international-payments-portal/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js Backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── scripts/            # Database scripts
│   ├── utils/              # Utility functions
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Customer Routes
- `POST /api/customer/transactions` - Create payment
- `GET /api/customer/transactions` - Get customer transactions
- `GET /api/customer/transactions/:id` - Get specific transaction

### Employee Routes
- `GET /api/employee/transactions/pending` - Get pending transactions
- `PATCH /api/employee/transactions/:id/verify` - Verify transaction
- `PATCH /api/employee/transactions/:id/submit` - Submit to SWIFT
- `POST /api/employee/transactions/bulk-submit` - Bulk submit
- `GET /api/employee/dashboard/stats` - Dashboard statistics

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt hashing with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Server-side and client-side validation
- **XSS Protection**: Cross-site scripting prevention
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **MongoDB Injection**: NoSQL injection prevention

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

### Manual Testing
1. Open http://localhost:3000
2. Register a new user or login with test credentials
3. Test customer features (create payments, view history)
4. Login as employee to test verification and SWIFT submission

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables in production
2. Use MongoDB Atlas for production database
3. Update CORS settings for production frontend URL

### Frontend Deployment (Netlify/Vercel)
1. Build the production version: `npm run build`
2. Deploy the `build` folder
3. Update API URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all environment variables are set
4. Check that all dependencies are installed
5. Review the API endpoints and test credentials

## 📸 Screenshots

### Login Page
![Login Page](docs/screenshots/login/01-login-page.png)
*Beautiful gradient background with security indicators and professional design*

### Customer Dashboard
![Customer Dashboard](docs/screenshots/customer-dashboard/01-welcome-hero.png)
*Hero section with personalized welcome message and security indicators*

![Payment Form](docs/screenshots/customer-dashboard/02-payment-form.png)
*International payment creation form with validation and South African examples*

![Transaction History](docs/screenshots/customer-dashboard/03-transaction-history.png)
*Complete transaction history with status tracking and pagination*

### Employee Dashboard
![Employee Dashboard](docs/screenshots/employee-dashboard/01-dashboard-stats.png)
*Statistics dashboard with real-time transaction metrics*

![Pending Transactions](docs/screenshots/employee-dashboard/02-pending-transactions.png)
*Pending transactions management with verification and SWIFT submission*

![Bulk Operations](docs/screenshots/employee-dashboard/05-bulk-operations.png)
*Bulk transaction processing for efficient workflow management*

### Security Features
![Security Headers](docs/screenshots/security/01-browser-security-headers.png)
*Browser security headers demonstrating bank-grade protection*

![Rate Limiting](docs/screenshots/security/02-rate-limiting.png)
*Rate limiting protection against brute force attacks*

### GitHub Repository
![Repository Overview](docs/screenshots/github/01-repository-overview.png)
*Complete codebase with professional structure and documentation*

![CircleCI Pipeline](docs/screenshots/github/03-circleci-config.png)
*Automated CI/CD pipeline with security scanning and quality checks*

## 🎬 Video Demonstration

For a complete walkthrough of all features, security measures, and code quality, watch the demonstration video showing:

- **Login Security**: Beautiful UI with rate limiting and validation
- **Customer Portal**: Payment creation with South African examples
- **Employee Portal**: Transaction verification and SWIFT submission
- **Security Features**: Headers, rate limiting, input validation
- **Code Quality**: GitHub repository, CircleCI, SonarQube integration

## 🎯 Future Enhancements

- [ ] Real SWIFT API integration
- [ ] Email notifications
- [ ] Transaction receipts (PDF generation)
- [ ] Multi-currency exchange rates
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication
- [ ] Audit logging
- [ ] File upload for supporting documents