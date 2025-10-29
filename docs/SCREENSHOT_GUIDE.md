# 📸 Screenshot Guide for Task 3 Demonstration

## 🎯 Quick Screenshot Checklist

### **1. Login Page** (`docs/screenshots/login/01-login-page.png`)
- **URL**: http://localhost:3000/login
- **What to show**: Beautiful gradient background, login form, security indicators
- **Key features**: Professional design, security notice at bottom

### **2. Customer Dashboard Hero** (`docs/screenshots/customer-dashboard/01-welcome-hero.png`)
- **URL**: http://localhost:3000/customer (after login as `johnsmith`)
- **What to show**: Welcome message, security indicators, "New Payment" button
- **Key features**: Personalized greeting, gradient hero section

### **3. Payment Form** (`docs/screenshots/customer-dashboard/02-payment-form.png`)
- **Action**: Click "New Payment" button
- **What to show**: Payment form with South African example filled in
- **Use this data**:
  ```
  Amount: 15000
  Currency: ZAR
  Account: GB29NWBK60161331926819
  SWIFT: NWBKGB2L
  Name: John Williams
  Bank: National Westminster Bank
  Purpose: Import payment for machinery
  ```

### **4. Transaction History** (`docs/screenshots/customer-dashboard/03-transaction-history.png`)
- **What to show**: Transaction table with existing transactions
- **Key features**: Status chips, pagination, transaction details

### **5. Employee Dashboard** (`docs/screenshots/employee-dashboard/01-dashboard-stats.png`)
- **Action**: Logout and login as `admin` / `Admin123!`
- **URL**: http://localhost:3000/employee
- **What to show**: Statistics cards, pending transactions count

### **6. Pending Transactions** (`docs/screenshots/employee-dashboard/02-pending-transactions.png`)
- **What to show**: Pending transactions table with Verify/Submit buttons
- **Key features**: Bulk operations, transaction details

### **7. Security Headers** (`docs/screenshots/security/01-browser-security-headers.png`)
- **Action**: Open browser Developer Tools (F12) → Network tab
- **What to show**: Security headers in response (HSTS, CSP, etc.)

### **8. GitHub Repository** (`docs/screenshots/github/01-repository-overview.png`)
- **URL**: https://github.com/Petermolepomatale/international-payments-portal
- **What to show**: Repository structure, README, file organization

### **9. CircleCI Config** (`docs/screenshots/github/03-circleci-config.png`)
- **File**: `.circleci/config.yml` in your repository
- **What to show**: CI/CD pipeline configuration

## 🔧 Screenshot Tips

### **Browser Setup**
- Use **Chrome** or **Edge** for best rendering
- Set zoom to **100%**
- Use **1920x1080** resolution or higher
- Clear browser cache before screenshots

### **Quality Guidelines**
- **Format**: PNG for UI screenshots
- **Quality**: High quality, minimal compression
- **Naming**: Use exact filenames as listed above
- **Size**: Minimum 1920x1080 for desktop views

### **What to Highlight**
- ✅ Beautiful gradient backgrounds
- ✅ Professional form layouts
- ✅ Security indicators and features
- ✅ Responsive design elements
- ✅ Error handling and validation
- ✅ Success states and confirmations

## 🎬 Video Recording Order

1. **Login** → Show security features
2. **Customer Dashboard** → Create payment with SA data
3. **Logout** → Switch to employee
4. **Employee Dashboard** → Show statistics
5. **Verify Transaction** → Process the payment
6. **Submit to SWIFT** → Complete workflow
7. **GitHub** → Show code quality
8. **Security** → Demonstrate protection

## 📱 Mobile Screenshots (Optional)

Take additional screenshots on mobile devices:
- iPhone/Android portrait mode
- Tablet landscape mode
- Show responsive design

---

**After taking screenshots, replace the placeholder files in `docs/screenshots/` with your actual images!**