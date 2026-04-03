# ⚡ QUICK START TESTING GUIDE

**Last Updated:** April 3, 2026
**Document:** Quick testing and verification guide with specific test values

---

## 🎯 CURRENT STATUS

### Running Services:
```
✅ Backend: http://localhost:5002
✅ Frontend: http://localhost:5178
⚠️ Database: MongoDB NOT CONNECTED (connection refused)
```

### What Works Without MongoDB:
- Health check endpoint: `GET /` → "Wealth Tracker API Running"
- Rate limiting configured
- Security headers (Helmet.js) active
- CORS configured

### What Requires MongoDB:
- All database operations (create, read, update, delete)
- User authentication
- Data aggregation and analytics

---

## 🔧 SETUP MONGODB (REQUIRED TO PROCEED)

### Quick Option: Use mongod directly (Windows)
```powershell
# If MongoDB is installed:
mongod

# OR start as service:
net start MongoDB
```

### Alternative: Use MongoDB in Docker
```powershell
# If Docker is installed:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify connection:
# Should connect automatically if running
```

### Cloud Option: MongoDB Atlas
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create cluster
3. Get connection string (looks like):
   mongodb+srv://username:password@cluster.mongodb.net/wealth-tracker
4. Update backend/.env:
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wealth-tracker
5. Restart backend: npm run start
```

---

## 🧪 COMPLETE TEST FLOW (After MongoDB Setup)

### Test User Credentials (Use These Values):
```
Name: Test User
Email: testuser@wealth-tracker.com
Password: TestPassword123!@#
```

### Test Data Values to Use:
```
Income:
- Source: Salary
- Amount: 50000
- Date: 2026-04-03

Expenses:
- Category: Food
- Amount: 500
- Date: 2026-04-03

Budget:
- Category: Food
- Limit: 3000
- Month: 4
- Year: 2026

Goal:
- Title: Buy Laptop
- Target: 80000
- Deadline: 2026-12-31
```

---

## ✅ TEST SEQUENCE

### 1️⃣ AUTHENTICATION TESTS

#### A. User Registration
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@wealth-tracker.com",
    "password": "TestPassword123!@#"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "testuser@wealth-tracker.com"
  },
  "message": "User registered successfully"
}
```

#### B. User Login
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@wealth-tracker.com",
    "password": "TestPassword123!@#"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Test User",
      "email": "testuser@wealth-tracker.com"
    }
  },
  "message": "Login successful"
}
```

**⚠️ SAVE THE TOKEN** - Use it for all subsequent requests:
```
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2️⃣ INCOME MANAGEMENT TESTS

#### A. Add Income
```bash
curl -X POST http://localhost:5002/api/income \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "source": "Salary",
    "amount": 50000,
    "date": "2026-04-03",
    "notes": "Monthly salary"
  }'
```

**Expected Response:** ✅ Income created with _id

#### B. Get All Incomes
```bash
curl -X GET http://localhost:5002/api/income \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** List of all incomes (sorted by date, newest first)

#### C. Update Income (change amount to 52000)
```bash
curl -X PUT http://localhost:5002/api/income/[INCOME_ID] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "source": "Salary",
    "amount": 52000,
    "date": "2026-04-03",
    "notes": "Monthly salary - Bonus added"
  }'
```

**Expected:** Updated income record

#### D. Delete Income
```bash
curl -X DELETE http://localhost:5002/api/income/[INCOME_ID] \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** Success message

---

### 3️⃣ EXPENSE TRACKING TESTS

#### A. Add Expense
```bash
curl -X POST http://localhost:5002/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "category": "Food",
    "amount": 500,
    "date": "2026-04-03",
    "notes": "Lunch and groceries"
  }'
```

**Expected:** Transaction created

#### B. Get All Expenses
```bash
curl -X GET "http://localhost:5002/api/transactions?type=expense" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** All expenses returned

#### C. Add Multiple Expenses for Testing
```bash
# Travel
curl -X POST http://localhost:5002/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "category": "Travel",
    "amount": 1000,
    "notes": "Uber rides"
  }'

# Shopping
curl -X POST http://localhost:5002/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "category": "Shopping",
    "amount": 2000,
    "notes": "Clothes"
  }'

# Bills
curl -X POST http://localhost:5002/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "category": "Bills",
    "amount": 5000,
    "notes": "Electricity bill"
  }'
```

#### D. Update Expense
```bash
curl -X PUT http://localhost:5002/api/transactions/[EXPENSE_ID] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "category": "Food",
    "amount": 750,
    "notes": "Updated - dinner included"
  }'
```

#### E. Delete Expense
```bash
curl -X DELETE http://localhost:5002/api/transactions/[EXPENSE_ID] \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4️⃣ BUDGET MANAGEMENT TESTS

#### A. Create Budget
```bash
curl -X POST http://localhost:5002/api/budget \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "Food",
    "limit": 3000,
    "month": 4,
    "year": 2026
  }'
```

**Expected:** Budget created

#### B. Get All Budgets
```bash
curl -X GET http://localhost:5002/api/budget \
  -H "Authorization: Bearer $TOKEN"
```

#### C. Get Budgets by Month
```bash
curl -X GET http://localhost:5002/api/budget/4/2026 \
  -H "Authorization: Bearer $TOKEN"
```

#### D. Create Multiple Budgets
```bash
# Travel budget
curl -X POST http://localhost:5002/api/budget \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "Travel",
    "limit": 5000,
    "month": 4,
    "year": 2026
  }'

# Shopping budget
curl -X POST http://localhost:5002/api/budget \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "Shopping",
    "limit": 10000,
    "month": 4,
    "year": 2026
  }'
```

#### E. Update Budget
```bash
curl -X PUT http://localhost:5002/api/budget/[BUDGET_ID] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "limit": 4000
  }'
```

#### F. Delete Budget
```bash
curl -X DELETE http://localhost:5002/api/budget/[BUDGET_ID] \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5️⃣ GOAL TRACKING TESTS

#### A. Create Goal
```bash
curl -X POST http://localhost:5002/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Buy Laptop",
    "targetAmount": 80000,
    "deadline": "2026-12-31"
  }'
```

**Expected:** Goal created with _id

#### B. Get All Goals
```bash
curl -X GET http://localhost:5002/api/goals \
  -H "Authorization: Bearer $TOKEN"
```

#### C. Create Multiple Goals
```bash
# Vacation goal
curl -X POST http://localhost:5002/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Vacation Fund",
    "targetAmount": 100000,
    "deadline": "2026-07-31"
  }'

# Emergency fund goal
curl -X POST http://localhost:5002/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Emergency Fund",
    "targetAmount": 300000,
    "deadline": "2027-04-03"
  }'
```

#### D. Update Goal Progress (add savings)
```bash
curl -X PUT http://localhost:5002/api/goals/[GOAL_ID] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "savedAmount": 20000
  }'
```

**Expected Response:** Updated goal with progress % calculated

#### E. Delete Goal
```bash
curl -X DELETE http://localhost:5002/api/goals/[GOAL_ID] \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6️⃣ ANALYTICS TESTS

#### A. Get Financial Summary
```bash
curl -X GET http://localhost:5002/api/analytics/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 50000,
      "totalExpenses": 8500,
      "balance": 41500,
      "savingsRate": 83.0
    },
    "monthly": {
      "currentMonth": 4,
      "currentYear": 2026,
      "income": 50000,
      "expenses": 8500,
      "netCash": 41500,
      "categorySpending": [
        { "_id": "Food", "total": 500 },
        { "_id": "Shopping", "total": 2000 },
        { "_id": "Bills", "total": 5000 },
        { "_id": "Travel", "total": 1000 }
      ]
    },
    "budgets": [
      {
        "category": "Food",
        "limit": 3000,
        "spent": 500,
        "remaining": 2500
      }
    ],
    "goals": [
      {
        "id": "...",
        "title": "Buy Laptop",
        "targetAmount": 80000,
        "savedAmount": 0,
        "progress": 0,
        "deadline": "2026-12-31"
      }
    ]
  }
}
```

---

## 🎨 FRONTEND TESTING (Manual)

After MongoDB is set up, test the frontend UI:

### 1. Access Frontend
```
Open: http://localhost:5178
```

### 2. Register & Login Flow
- Click "Register" 
- Use credentials: email=testuser@wealth-tracker.com, password=TestPassword123!@#
- Should redirect to login page
- Login with same credentials
- Should redirect to Analytics page

### 3. Test Each Page
- **Dashboard:** Add/view/delete transactions
- **Income:** Add/edit/delete income entries
- **Expenses:** Add/edit/delete expenses
- **Budgets:** Create budgets, verify budget usage
- **Goals:** Create goals, update progress
- **Analytics:** View summary cards, recent transactions

### 4. Verify UI Features
- ✅ Responsive layout on mobile (open DevTools)
- ✅ Loading spinners appear
- ✅ Error messages display
- ✅ Success messages appear
- ✅ Form validation works
- ✅ Navigation bar functional
- ✅ Logout works

---

## 🐛 DEBUGGING CHECKLIST

### If Tests Fail:

#### 1. Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:5002/

# Should return: "Wealth Tracker API Running"
```

#### 2. MongoDB Connection Issues
```bash
# Check backend logs for:
# Should show "Server running on http://localhost:5002"
# If no "MongoDB Connected", MongoDB isn't running
```

#### 3. Authentication Issues
```bash
# Verify token format in curl command
# Should be: Authorization: Bearer [token]

# Token should be returned from login endpoint
# Token expires in 7 days
```

#### 4. CORS Issues
```bash
# If frontend can't reach backend, check:
# 1. Backend .env has FRONTEND_URL=http://localhost:5178
# 2. Frontend .env has VITE_API_URL=http://localhost:5002/api
# 3. Both servers are running
```

#### 5. Port Conflicts
```bash
# If ports 5002 or 5178 are in use:
# Backend: Change PORT in backend/.env
# Frontend: Vite will automatically choose next available port
```

---

## 📊 DATA PERSISTENCE TEST

To verify data persists correctly:

1. Add income: $50,000
2. Add expenses: $8,500 total
3. Create budget for Food: $3,000 limit
4. Create goal: Buy Laptop for $80,000
5. Refresh browser (F5)
6. All data should still be visible
7. Analytics should show updated calculations

---

## 🎯 SUCCESS INDICATORS

### Backend Tests Pass If:
- ✅ All curl commands return success responses
- ✅ Data is stored in MongoDB
- ✅ Calculations are correct (balance, savings rate)
- ✅ Budget tracking shows spent vs. remaining
- ✅ Goal progress % calculated correctly

### Frontend Tests Pass If:
- ✅ Can register and login
- ✅ Can add/edit/delete all data types
- ✅ UI updates in real-time
- ✅ Analytics show correct calculations
- ✅ No console errors (open DevTools)
- ✅ Navigation works smoothly
- ✅ Responsive on mobile view

---

## 📝 TEST RESULTS LOG

Create a file to log your test results:

```
Date: 2026-04-03
Time: [current time]

MongoDB Configuration:
[ ] Local Installation
[ ] Docker
[ ] MongoDB Atlas
Connection String: [if cloud]

Authentication Tests:
[ ] Register successful
[ ] Login successful
[ ] Token obtained

Income Tests:
[ ] Add income working
[ ] Update income working
[ ] Delete income working
[ ] Calculations correct

Expense Tests:
[ ] Add expense working
[ ] Update expense working
[ ] Delete expense working
[ ] Category filtering working

Budget Tests:
[ ] Create budget working
[ ] Budget tracking accurate
[ ] Budget remaining calculated correctly

Goal Tests:
[ ] Create goal working
[ ] Update progress working
[ ] Progress % calculated correctly

Analytics Tests:
[ ] Summary API returning data
[ ] Calculations accurate
[ ] Monthly vs. all-time correct

Frontend Tests:
[ ] Register/Login working
[ ] All pages accessible
[ ] Real-time updates working
[ ] No console errors
[ ] Responsive on mobile

Overall Status: [PASS/FAIL]
Notes: [Any issues or observations]
```

---

## 🚀 NEXT STEPS

1. **Setup MongoDB** - Choose one of three options above
2. **Verify Backend Connection** - Restart server, check logs
3. **Run Test Sequence** - Follow tests in order 1-6
4. **Test Frontend** - Manually test each page
5. **Log Results** - Document what passed/failed
6. **Deploy** - Ready for production after all tests pass

---

**Updated:** April 3, 2026
**Status:** Ready for MongoDB connection and testing
