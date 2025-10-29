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

## 📸 Application Screenshots

### 🔐 Login & Authentication
![Login Page - Employee Access](https://github.com/user-attachments/assets/login-employee.png)
*Professional login interface with gradient background, security indicators, and employee authentication. Features SSL encryption notice and bank-grade security measures.*

![Login Page - Customer Access](https://github.com/user-attachments/assets/login-customer.png)
*Beautiful login page with animated gradient background, security features, and professional design. Shows secure authentication with SSL encryption and security indicators.*

### 👨‍💼 Employee Dashboard
![Employee Dashboard - Statistics Overview](https://github.com/user-attachments/assets/employee-dashboard.png)
*Comprehensive employee dashboard showing real-time statistics: 5 total transactions, 0 pending review, 1 today's transaction, and 0 completed today. Features modern card-based layout with colorful icons and metrics.*

![Pending Transactions Management](https://github.com/user-attachments/assets/pending-transactions.png)
*Employee transaction management interface with bulk operations, refresh functionality, and "Bulk Submit" capabilities. Clean table layout for efficient transaction processing and SWIFT submission.*

### 👤 Customer Portal
![Transaction History - Customer View](https://github.com/user-attachments/assets/transaction-history.png)
*Customer transaction history showing completed payments including:*
- *ZAR 15,000.00 to Peter Molepo (Import payment for machinery) - Verified*
- *$1,500.00 to Robert Wilson (Business payment) - Verified* 
- *$1,200.00 to Hans Muller (Investment) - Submitted to SWIFT*

*Features status tracking, SWIFT codes, and comprehensive transaction details.*

### 🎨 UI/UX Features
- **Beautiful Gradient Backgrounds**: Modern purple-to-blue gradients with animated elements
- **Professional Card Layouts**: Clean, modern interface with proper spacing and typography
- **Status Indicators**: Color-coded transaction statuses (Verified, Submitted to SWIFT)
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Security Indicators**: SSL encryption notices and bank-grade security features
- **Role-Based Access**: Separate interfaces for customers and employees

### 🛡️ Security Features Demonstrated
- **SSL Encryption**: Secure login with bank-grade security
- **Role-Based Authentication**: Customer and Employee access levels
- **Transaction Verification**: Multi-step approval process
- **SWIFT Integration**: Secure international payment processing
- **Input Validation**: Comprehensive form validation and sanitization

### 💼 Business Features Showcased

#### **Employee Capabilities**
- **Dashboard Analytics**: Real-time transaction statistics and metrics
- **Transaction Management**: View, verify, and process pending payments
- **Bulk Operations**: Efficient processing of multiple transactions
- **SWIFT Submission**: Direct integration with international payment networks
- **Audit Trail**: Complete transaction history and status tracking

#### **Customer Experience**
- **Transaction History**: Comprehensive view of all payment activities
- **Status Tracking**: Real-time updates on payment processing stages
- **International Payments**: Support for multiple currencies (ZAR, USD, EUR, GBP)
- **Secure Processing**: Bank-grade security for all transactions
- **User-Friendly Interface**: Intuitive design for easy navigation

#### **Technical Excellence**
- **MERN Stack**: Modern full-stack JavaScript architecture
- **TypeScript**: Type-safe development for reliability
- **Material-UI**: Professional, responsive user interface
- **MongoDB**: Scalable database for transaction management
- **JWT Authentication**: Secure token-based user sessions
- **RESTful API**: Clean, documented backend architecture

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