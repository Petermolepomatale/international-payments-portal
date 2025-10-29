# Setup Instructions for International Payments Portal

## MongoDB Installation and Setup

### Option 1: Install MongoDB Locally

#### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB following the installer instructions
3. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```

#### macOS:
1. Install using Homebrew:
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```
2. Start MongoDB:
   ```bash
   brew services start mongodb-community
   ```

#### Linux (Ubuntu):
1. Import MongoDB public key:
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```
2. Add MongoDB repository:
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   ```
3. Install MongoDB:
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```
4. Start MongoDB:
   ```bash
   sudo systemctl start mongod
   ```

### Option 2: Use MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update the DATABASE environment variable in `.env.development`:
   ```
   DATABASE=mongodb+srv://username:password@cluster.mongodb.net/international_payments
   ```

### Option 3: Use Docker

1. Install Docker
2. Run MongoDB in a container:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## Running the Application

### 1. Start MongoDB
Make sure MongoDB is running using one of the methods above.

### 2. Backend Setup
```bash
cd server
npm install
npm run seed    # This will create sample data
npm run dev     # Start the backend server
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm start       # Start the React development server
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Sample Login Credentials

### Customers:
- Username: `johnsmith` | Password: `Password123!`
- Username: `sarahj` | Password: `Password123!`
- Username: `michaelb` | Password: `Password123!`

### Employees:
- Username: `admin` | Password: `Admin123!`
- Username: `officer` | Password: `Officer123!`

## Testing the Application

1. **Customer Flow:**
   - Register a new account or login with sample credentials
   - Create a new international payment
   - View transaction history

2. **Employee Flow:**
   - Login with employee credentials
   - View pending transactions
   - Verify and submit transactions to SWIFT
   - Use bulk operations

## Troubleshooting

### MongoDB Connection Issues:
- Ensure MongoDB is running on port 27017
- Check firewall settings
- Verify connection string in environment variables

### Port Conflicts:
- Backend runs on port 5000
- Frontend runs on port 3000
- Change ports in environment variables if needed

### CORS Issues:
- Ensure the proxy is set in client/package.json
- Check FRONTEND_URL in backend environment variables