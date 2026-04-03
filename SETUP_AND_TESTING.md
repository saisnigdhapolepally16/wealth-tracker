# 📊 Wealth Tracker - Setup & Testing Guide

## 🚀 QUICK START

### Prerequisites
- Node.js 16+ and npm
- MongoDB running locally or connection string
- Git

---

## 📦 SETUP INSTRUCTIONS

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

**Configure Environment:**
```bash
# Edit .env file with your values
PORT=5000
MONGO_URI=mongodb://localhost:27017/wealth-tracker
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

**Start Backend:**
```bash
npm start
# Server runs on http://localhost:5000
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

**Configure Environment:**
```bash
# Create .env.local (optional)
VITE_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🧪 API TESTING GUIDE

### Test Flow:
1. Register a new user
2. Login to get JWT token
3. Test all endpoints with the token

---

## 📝 API ENDPOINTS & CURL TESTS

### 🔐 AUTHENTICATION

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "...",
    "email": "john@example.com"
  }
}
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Save the token for next requests:**
```bash
TOKEN="<paste-token-here>"
```

---

### 💰 TRANSACTIONS

#### Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "amount": 50.00,
    "category": "Food",
    "notes": "Lunch with friends"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "...",
    "userId": "...",
    "type": "expense",
    "amount": 50,
    "category": "Food",
    "notes": "Lunch with friends",
    "date": "2024-04-03T...",
    "createdAt": "..."
  }
}
```

#### Get All Transactions
```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Transactions (with filters)
```bash
curl -X GET "http://localhost:5000/api/transactions?type=expense&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

#### Update Transaction
```bash
curl -X PUT http://localhost:5000/api/transactions/<transaction-ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "amount": 60.00,
    "category": "Food",
    "notes": "Updated amount"
  }'
```

#### Delete Transaction
```bash
curl -X DELETE http://localhost:5000/api/transactions/<transaction-ID> \
  -H "Authorization: Bearer $TOKEN"
```

---

### 💵 INCOME

#### Create Income
```bash
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "source": "Monthly Salary",
    "amount": 3000,
    "notes": "March salary"
  }'
```

#### Get All Income
```bash
curl -X GET http://localhost:5000/api/income \
  -H "Authorization: Bearer $TOKEN"
```

#### Update Income
```bash
curl -X PUT http://localhost:5000/api/income/<income-ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "source": "Monthly Salary",
    "amount": 3200
  }'
```

#### Delete Income
```bash
curl -X DELETE http://localhost:5000/api/income/<income-ID> \
  -H "Authorization: Bearer $TOKEN"
```

---

### 📊 BUDGET

#### Create Budget
```bash
curl -X POST http://localhost:5000/api/budget \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "Food",
    "limit": 400,
    "month": 4,
    "year": 2024
  }'
```

#### Get All Budgets
```bash
curl -X GET http://localhost:5000/api/budget \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Budgets by Month
```bash
curl -X GET http://localhost:5000/api/budget/4/2024 \
  -H "Authorization: Bearer $TOKEN"
```

#### Update Budget
```bash
curl -X PUT http://localhost:5000/api/budget/<budget-ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "limit": 450
  }'
```

#### Delete Budget
```bash
curl -X DELETE http://localhost:5000/api/budget/<budget-ID> \
  -H "Authorization: Bearer $TOKEN"
```

---

### 🎯 GOALS

#### Create Goal
```bash
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Emergency Fund",
    "targetAmount": 5000,
    "deadline": "2025-12-31"
  }'
```

#### Get All Goals
```bash
curl -X GET http://localhost:5000/api/goals \
  -H "Authorization: Bearer $TOKEN"
```

#### Update Goal (Progress)
```bash
curl -X PUT http://localhost:5000/api/goals/<goal-ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "savedAmount": 1500
  }'
```

#### Delete Goal
```bash
curl -X DELETE http://localhost:5000/api/goals/<goal-ID> \
  -H "Authorization: Bearer $TOKEN"
```

---

### 📈 ANALYTICS

#### Get Summary & Analytics
```bash
curl -X GET http://localhost:5000/api/analytics/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Analytics summary retrieved successfully",
  "data": {
    "summary": {
      "totalIncome": 5000,
      "totalExpenses": 1200,
      "balance": 3800,
      "savingsRate": 76
    },
    "monthly": {
      "currentMonth": 4,
      "currentYear": 2024,
      "income": 3000,
      "expenses": 300,
      "netCash": 2700,
      "categorySpending": [
        {
          "_id": "Food",
          "total": 150
        },
        {
          "_id": "Travel",
          "total": 150
        }
      ]
    },
    "budgets": [
      {
        "category": "Food",
        "limit": 400,
        "spent": 150,
        "remaining": 250
      }
    ],
    "goals": [
      {
        "id": "...",
        "title": "Emergency Fund",
        "targetAmount": 5000,
        "savedAmount": 1500,
        "progress": 30,
        "deadline": "2025-12-31"
      }
    ]
  }
}
```

---

## ✅ VALIDATION RULES

### Authentication
- **Email:** Must be valid format (user@domain.com)
- **Password:** Minimum 8 characters
- **Name:** Minimum 2 characters

### Transactions
- **Type:** Must be "income" or "expense"
- **Amount:** Must be positive number
- **Category:** Required, minimum 1 character
- **Date:** Optional, ISO format (e.g., 2024-04-03T10:30:00Z)

### Income
- **Source:** Required, minimum 1 character
- **Amount:** Required, must be positive
- **Date:** Optional, ISO format
- **Notes:** Optional

### Budget
- **Category:** Required, must be one of: Food, Travel, Rent, Shopping, Bills, Other
- **Limit:** Required, must be positive
- **Month:** 1-12
- **Year:** Valid year (2000+)

### Goals
- **Title:** Minimum 3 characters
- **Target Amount:** Must be positive
- **Deadline:** Must be in the future

---

## 🐛 ERROR HANDLING

All errors follow the standard format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized / Invalid Token
- `404` - Not Found
- `500` - Server Error

---

## 📱 FRONTEND TESTING

### Login Flow
1. Go to http://localhost:5173
2. Click "Register here"
3. Fill in: Name, Email, Password, Confirm Password
4. Click Register
5. Login with your credentials
6. You'll be redirected to Analytics dashboard

### Dashboard Testing
1. Add an expense: Click "Add Transaction"
2. Fill: Type=Expense, Category=Food, Amount=50
3. Click "Add Transaction"
4. View in table below
5. Click "Delete" to remove

### Navigation
- **Analytics** - View financial summary
- **Income** - Track income sources
- **Expenses** - View all expenses
- **Budgets** - Set monthly budgets
- **Goals** - Track financial goals
- **Guide** - Getting started guide

---

## 🔧 TROUBLESHOOTING

### MongoDB Connection Failed
```
Error: MongoDB connection failed
Solution: Make sure MongoDB is running
- Linux/Mac: mongod
- Windows: Start MongoDB Server from Services
```

### Port Already in Use
```
Error: EADDRINUSE: address already in use :::5000
Solution: Change PORT in .env or kill process on port 5000
```

### CORS Error
```
Error: Cross-Origin Request Blocked
Solution: Check FRONTEND_URL in backend .env matches your frontend URL
```

### Token Expired
```
Error: Token has expired, please login again
Solution: You'll be automatically redirected to login page
```

---

## 📊 PROJECT STRUCTURE

```
wealth-tracker/
├── backend/
│   ├── src/
│   │   ├── server.js           # Main app
│   │   ├── models/             # Mongoose schemas
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Auth, error handling
│   │   ├── services/           # Business logic
│   │   ├── validations/        # Input validation
│   │   └── utils/              # Helpers
│   ├── .env                    # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── api.js              # Axios config
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🎯 NEXT STEPS

### Feature Development Roadmap
1. ✅ Authentication
2. ✅ Transaction CRUD
3. ✅ Income Management
4. ✅ Budget Tracking
5. ✅ Goal Tracking
6. ✅ Basic Analytics
7. 🚧 Advanced Dashboard
8. 🚧 Financial Insights
9. 🚧 Risk Analysis
10. 🚧 Forecasting & Reports

---

## 💬 SUPPORT

For issues or questions:
1. Check the troubleshooting section above
2. Review API response format
3. Ensure all environment variables are set
4. Check MongoDB connection
5. Verify token is being sent in Authorization header

---

**Last Updated:** April 2024  
**Status:** Stable (v1.0)
