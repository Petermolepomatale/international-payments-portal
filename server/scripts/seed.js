const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { DATABASE } = require('../config/env');

const User = require('../models/User');
const Transaction = require('../models/Transaction');

const seedData = async () => {
  try {
    await mongoose.connect(DATABASE);
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing data');

    // Create sample customers
    const customers = await User.create([
      {
        fullName: 'John Smith',
        idNumber: '8901234567890',
        accountNumber: '1234567890',
        username: 'johnsmith',
        password: 'Password123!',
        role: 'customer',
      },
      {
        fullName: 'Sarah Johnson',
        idNumber: '8901234567891',
        accountNumber: '1234567891',
        username: 'sarahj',
        password: 'Password123!',
        role: 'customer',
      },
      {
        fullName: 'Michael Brown',
        idNumber: '8901234567892',
        accountNumber: '1234567892',
        username: 'michaelb',
        password: 'Password123!',
        role: 'customer',
      },
    ]);

    // Create sample employees
    const employees = await User.create([
      {
        fullName: 'Admin User',
        idNumber: '8901234567888',
        accountNumber: '1000000001',
        username: 'admin',
        password: 'Admin123!',
        role: 'employee',
      },
      {
        fullName: 'Payment Officer',
        idNumber: '8901234567889',
        accountNumber: '1000000002',
        username: 'officer',
        password: 'Officer123!',
        role: 'employee',
      },
    ]);

    // Create sample transactions
    const transactions = await Transaction.create([
      {
        customer: customers[0]._id,
        amount: 1500.00,
        currency: 'USD',
        provider: 'SWIFT',
        payeeAccount: 'GB29NWBK60161331926819',
        swiftCode: 'NWBKGB2L',
        payeeName: 'Robert Wilson',
        payeeBank: 'National Westminster Bank',
        purpose: 'Business payment',
        status: 'pending',
      },
      {
        customer: customers[1]._id,
        amount: 2500.50,
        currency: 'EUR',
        provider: 'SWIFT',
        payeeAccount: 'DE89370400440532013000',
        swiftCode: 'DEUTDEFF',
        payeeName: 'Anna Schmidt',
        payeeBank: 'Deutsche Bank',
        purpose: 'Invoice payment',
        status: 'pending',
      },
      {
        customer: customers[2]._id,
        amount: 500.75,
        currency: 'GBP',
        provider: 'SWIFT',
        payeeAccount: 'FR1420041010050500013M02606',
        swiftCode: 'BNPAFRPP',
        payeeName: 'Pierre Dubois',
        payeeBank: 'BNP Paribas',
        purpose: 'Personal transfer',
        status: 'verified',
        verifiedAt: new Date(),
      },
      {
        customer: customers[0]._id,
        amount: 1200.00,
        currency: 'USD',
        provider: 'SWIFT',
        payeeAccount: 'CH9300762011623852957',
        swiftCode: 'UBSWCHZH80A',
        payeeName: 'Hans Muller',
        payeeBank: 'UBS Switzerland',
        purpose: 'Investment',
        status: 'submitted',
        submittedBy: employees[0]._id,
        submittedAt: new Date(),
      },
    ]);

    console.log('Seed data created successfully:');
    console.log(`- ${customers.length} customers`);
    console.log(`- ${employees.length} employees`);
    console.log(`- ${transactions.length} transactions`);
    console.log('\nSample login credentials:');
    console.log('Customer: johnsmith / Password123!');
    console.log('Employee: admin / Admin123!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();