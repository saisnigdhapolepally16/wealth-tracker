# 🏗️ WEALTH TRACKER - SYSTEM ARCHITECTURE & DESIGN

**Version:** 1.0  
**Date:** April 3, 2026  
**Status:** Production-Ready

---

## 📐 SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                     WEALTH TRACKER APPLICATION               │
├──────────────────────────┬──────────────────────────────────┤
│      FRONTEND (React)    │      BACKEND (Node.js/Express)   │
├──────────────────────────┼──────────────────────────────────┤
│                          │                                  │
│  Pages:                  │  Controllers:                    │
│  ├─ Login.jsx           │  ├─ authController.js           │
│  ├─ Register.jsx        │  ├─ incomeController.js         │
│  ├─ Dashboard.jsx       │  ├─ transactionController.js    │
│  ├─ Income.jsx          │  ├─ budgetController.js         │
│  ├─ Expenses.jsx        │  ├─ goalController.js           │
│  ├─ Budgets.jsx         │  └─ analyticsController.js      │
│  ├─ Goals.jsx           │                                  │
│  ├─ Analytics.jsx       │  Models:                         │
│  └─ Home.jsx            │  ├─ user.js                     │
│                          │  ├─ income.js                   │
│  Components:             │  ├─ transaction.js              │
│  ├─ Navbar.jsx          │  ├─ Budget.js                   │
│  ├─ PrivateRoute.jsx    │  └─ Goals.js                    │
│  ├─ TransactionForm     │                                  │
│  └─ TransactionList     │  Middleware:                     │
│                          │  ├─ authMiddleware.js           │
│  Tools:                  │  └─ errorHandler.js             │
│  ├─ React 19.2.4        │                                  │
│  ├─ React Router 7      │  Services:                       │
│  ├─ Axios API Client    │  └─ transactionService.js       │
│  ├─ Recharts            │                                  │
│  └─ Tailwind CSS        │  Utilities:                      │
│                          │  ├─ responseHandler.js          │
│                          │  └─ validations/                │
│                          │                                  │
│                          │  Routes:                         │
│                          │  ├─ authRoutes.js               │
│                          │  ├─ incomeRoutes.js             │
│                          │  ├─ transactionRoutes.js        │
│                          │  ├─ budgetRoutes.js             │
│                          │  ├─ goalRoutes.js               │
│                          │  └─ analyticsRoutes.js          │
│                          │                                  │
│                          │  Express Setup:                  │
│                          │  ├─ Helmet.js (security)        │
│                          │  ├─ CORS (cross-origin)         │
│                          │  ├─ Rate Limiting               │
│                          │  └─ Body Parser (JSON)          │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
                 ⬇️ AXIOS INTERCEPTORS (JWT TOKEN)
                 ⬇️ REST API CALLS
                 ⬆️ JSON RESPONSES
         ┌────────────────────────────────────────┐
         │    🗄️ MongoDB Database                 │
         │    ├─ Users Collection                 │
         │    ├─ Income Collection                │
         │    ├─ Transactions Collection          │
         │    ├─ Budgets Collection               │
         │    └─ Goals Collection                 │
         └────────────────────────────────────────┘
```

---

## 📡 DATA FLOW ARCHITECTURE

### User Registration & Authentication Flow
```
┌──────────────────┐
│   User Input     │
│  (Register Page) │
└────────┬─────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  Frontend Validation          │  (Client-side checks)
│  - Email format               │  - Password min length
│  - Password confirmation      │  - Name validation
└────────┬─────────────────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  POST /auth/register          │  (API Request)
│  Headers: Content-Type: json  │
│  Body: {name, email, pwd}    │
└────────┬─────────────────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  Zod Schema Validation        │  (Server-side validation)
│  - Email format               │  - Password strength
│  - Required fields            │  - String trimming
└────────┬─────────────────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  Check if User Exists         │
│  Query: User.findOne({email}) │
└────────┬─────────────────────┘
         │
         ├─ If exists: Return 400 error
         │
         ⬇️
┌──────────────────────────────┐
│  Hash Password (bcrypt, 10)   │  (Security)
│  Cost: 10 (strong)            │
└────────┬─────────────────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  Create User in MongoDB       │
│  Save hashed password         │
│  Store timestamps             │
└────────┬─────────────────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  Return Success Response      │
│  - userId                     │  (NO password in response)
│  - email                      │
└──────────────────────────────┘
```

### Login & Token Flow
```
┌──────────────────┐
│   Login Form     │
│  (Email & Pwd)   │
└────────┬─────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  POST /auth/login             │
└────────┬─────────────────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  Find User: User.findOne      │
│  Query by email               │
└────────┬─────────────────────┘
         │
         ├─ If not found: Return 401
         │
         ⬇️
┌──────────────────────────────┐
│  Compare Passwords (bcrypt)   │
│  bcrypt.compare(input, hash)  │
└────────┬─────────────────────┘
         │
         ├─ If mismatch: Return 401
         │
         ⬇️
┌──────────────────────────────┐
│  Generate JWT Token           │
│  Payload: {id: userId}        │  (Sign with JWT_SECRET)
│  Expires in: 7 days          │  (Configurable)
└────────┬─────────────────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  Return Token + User Data     │
│  - token (JWT)                │
│  - user {id, name, email}    │
└──────────────────────────────┘
         │
         ⬇️
┌──────────────────────────────┐
│  Frontend Stores Token        │
│  localStorage.setItem("token")│
└──────────────────────────────┘
```

### Protected API Request Flow
```
┌─────────────────────────────────┐
│  Frontend API Call              │
│  GET /api/income                │
│  (Any protected endpoint)        │
└────────┬────────────────────────┘
         │
         ⬇️
┌─────────────────────────────────┐
│  Axios Request Interceptor      │
│  Retrieves token from localStorage
│  Adds header: Authorization: Bearer [token]
└────────┬────────────────────────┘
         │
         ⬇️
┌─────────────────────────────────┐
│  POST/GET/PUT/DELETE Request    │
│  With Authorization Header     │
└────────┬────────────────────────┘
         │
         ⬇️
┌─────────────────────────────────┐
│  Backend: authMiddleware        │
│  - Extract token from header    │
│  - Verify with JWT_SECRET       │
│  - Check expiration             │
└────────┬────────────────────────┘
         │
         ├─ If invalid: Return 401
         ├─ If expired: Return 401 (refresh)
         │
         ⬇️
┌─────────────────────────────────┐
│  Set req.user = userId (decoded)│
│  Proceed to route handler       │
└─────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA DESIGN

### User Schema
```javascript
{
  _id: ObjectId (auto),
  name: String (required, min: 2),
  email: String (required, unique, validated),
  password: String (required, bcrypt hashed, min: 8),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

Indexes:
- _id (default primary key)
- email (unique)
```

### Income Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  source: String (required, e.g., "Salary", "Freelance"),
  amount: Number (required, min: 0.01),
  date: Date (default: Date.now),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- userId (for user queries)
- date (for sorting/filtering)
```

### Transaction Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  type: Enum (["income", "expense"], required),
  category: String (required),
  amount: Number (required, min: 0.01),
  date: Date (default: Date.now),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- userId (for user queries)
- type (for filtering)
- date (for chronological sorting)
```

### Budget Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  category: String (enum, required),
  limit: Number (required, min: 0.01),
  month: Number (1-12, required),
  year: Number (required),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- (userId, category, month, year) - unique compound index
```

### Goal Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  title: String (required),
  targetAmount: Number (required, min: 0.01),
  savedAmount: Number (default: 0, min: 0),
  deadline: Date (required, must be future),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- userId (for user queries)
- deadline (for sorting)
```

---

## 🔄 API ENDPOINT ARCHITECTURE

### Authentication Endpoints
```
POST /api/auth/register
├─ Body: {name, email, password}
├─ Validation: Zod schema
├─ Response: {userId, email}
└─ Security: Password hashed, no token returned

POST /api/auth/login
├─ Body: {email, password}
├─ Validation: Email & password
├─ Response: {token, user{id, name, email}}
└─ Security: Token expires in 7 days
```

### Income Endpoints
```
POST /api/income
├─ Auth: Required
├─ Body: {source, amount, date, notes}
├─ Validation: Zod schema
└─ Response: Income object

GET /api/income
├─ Auth: Required
├─ Query Params: (optional filters)
├─ Purpose: Get all incomes
└─ Response: Array of incomes (sorted by date, desc)

PUT /api/income/:id
├─ Auth: Required
├─ Body: {source, amount, date, notes}
├─ Validation: Owned by user
└─ Response: Updated income object

DELETE /api/income/:id
├─ Auth: Required
├─ Validation: Owned by user
└─ Response: Success message
```

### Transaction Endpoints
```
POST /api/transactions
├─ Auth: Required
├─ Body: {type, category, amount, date, notes}
├─ Validation: type enum, amount positive
└─ Response: Transaction object

GET /api/transactions
├─ Auth: Required
├─ Query: ?type=income|expense (optional)
├─ Purpose: Get all transactions
└─ Response: Array sorted by date

PUT /api/transactions/:id
├─ Auth: Required
├─ Validation: Owned by user
└─ Response: Updated transaction

DELETE /api/transactions/:id
├─ Auth: Required
├─ Response: Success message
```

### Budget Endpoints
```
POST /api/budget
├─ Auth: Required
├─ Body: {category, limit, month, year}
├─ Constraint: Unique per category per month
└─ Response: Budget object

GET /api/budget
├─ Auth: Required
└─ Response: All budgets for user

GET /api/budget/:month/:year
├─ Auth: Required
├─ Purpose: Get budgets for specific month
└─ Response: Filtered budgets

PUT /api/budget/:id
├─ Auth: Required
└─ Response: Updated budget

DELETE /api/budget/:id
├─ Auth: Required
└─ Response: Success message
```

### Goal Endpoints
```
POST /api/goals
├─ Auth: Required
├─ Body: {title, targetAmount, deadline}
├─ Validation: deadline must be future
└─ Response: Goal object

GET /api/goals
├─ Auth: Required
└─ Response: All goals (sorted by deadline)

PUT /api/goals/:id
├─ Auth: Required
├─ Body: {savedAmount}
└─ Response: Updated goal with progress %

DELETE /api/goals/:id
├─ Auth: Required
└─ Response: Success message
```

### Analytics Endpoints
```
GET /api/analytics/summary
├─ Auth: Required
├─ Method: Aggregation pipeline
├─ Returns:
│  ├─ summary {totalIncome, totalExpenses, balance, savingsRate}
│  ├─ monthly {income, expenses, categorySpending}
│  ├─ budgets {category, limit, spent, remaining}
│  └─ goals {title, progress%, deadline}
└─ Calculation: Real-time from MongoDB aggregation
```

---

## 🛡️ SECURITY ARCHITECTURE

### Password Security
```
User Input: "MyPassword123!@#"
                    ⬇️
            Validation (min 8 chars)
                    ⬇️
            bcrypt.hash(password, 10)
                    ⬇️
    Stored in DB: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUe6bl2lxyl6leluy.m
                    ⬇️
        (22 characters + 53 character hash)
                    ⬇️
            Never stored plaintext
            Never returned in API
            Double-hashed when compared
```

### JWT Token Security
```
Token Creation:
{
  id: userId,
  iat: IssuedAtTime,
  exp: ExpiresAt (7 days)
}
                    ⬇️
        Signed with JWT_SECRET
                    ⬇️
   Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                    ⬇️
        Stored in localStorage (client)
                    ⬇️
        Sent in Authorization header on requests
                    ⬇️
    Verified on backend: jwt.verify(token, JWT_SECRET)
```

### Authorization Flow
```
Request comes in
            ⬇️
authMiddleware checks
    - Header: Authorization: Bearer [token]
    - Token exists
    - Token is valid (not tampered)
    - Token is not expired
            ⬇️
    If invalid: 401 Unauthorized
    If expired: 401 Token has expired
            ⬇️
    If valid: Extract userId from decoded token
            ⬇️
    Set req.user = userId
            ⬇️
    Proceed to route handler
            ⬇️
    Handler uses req.user to filter user-specific data
```

### Data Ownership Verification
```
User A makes request to UPDATE Income ID X

Controller:
  1. Find income: Income.findOne({_id: X, userId: req.user})
  2. If not found: Return 404 or 403 (not found/unauthorized)
  3. If found: Proceed with update
  
Result: User A can only access User A's data
```

---

## ⚡ PERFORMANCE OPTIMIZATION STRATEGY

### Database Query Optimization
```
❌ Inefficient: Find all, then filter in code
✅ Efficient: Filter in database query
  Income.find({userId, date: {$gte: startDate, $lte: endDate}})

❌ Missing indexes: Full collection scan
✅ With indexes: Fast lookup
  transactionSchema.index({userId: 1})

❌ Return all fields: Extra data transfer
✅ Select specific fields: Faster response
  Income.find({userId}).select('amount date source')
```

### Frontend Rendering Optimization
```
❌ State updates without dependency array
✅ Proper useEffect dependencies
  useEffect(() => { fetch() }, [])

❌ Render list items without key prop
✅ Use unique keys for lists
  {items.map(item => <Component key={item._id} />)}

❌ API calls on every render
✅ Use loading state to prevent duplicates
  if (loading && !data) return <Spinner />
```

### Aggregation Pipeline (Analytics)
```
Instead of:
1. Get all transactions
2. Get all budgets
3. Calculate in application code

Use MongoDB Aggregation:
db.transactions.aggregate([
  {$match: {userId, type: "expense"}},
  {$group: {_id: "$category", total: {$sum: "$amount"}}},
  {$sort: {total: -1}}
])

Result: Server-side calculation, faster response
```

---

## 📊 COMPONENT STRUCTURE

### Frontend Component Hierarchy
```
App.jsx (Router setup)
├─ Routes
│  ├─ Login
│  ├─ Register
│  └─ PrivateRoute wrapper
│      ├─ Navbar
│      └─ Page Component
│          ├─ Dashboard
│          │  ├─ TransactionForm
│          │  └─ TransactionList
│          ├─ Income
│          │  ├─ Form
│          │  └─ List
│          ├─ Expenses
│          │  ├─ Form
│          │  └─ List
│          ├─ Budgets
│          │  ├─ Form
│          │  └─ List
│          ├─ Goals
│          │  ├─ Form
│          │  └─ List
│          └─ Analytics
│              ├─ Summary Cards
│              ├─ Charts (Recharts)
│              └─ Recent Transactions
```

---

## 🔌 External Dependencies

### Backend Dependencies
```
Express.js        - Web framework
Mongoose         - MongoDB ODM
JWT              - Token authentication
bcrypt           - Password hashing
Zod              - Input validation
Helmet.js        - Security headers
CORS             - Cross-origin requests
Rate-limit       - DDoS protection
```

### Frontend Dependencies
```
React           - UI framework
React Router    - Client-side routing
Axios           - HTTP client
Recharts        - Data visualization
Tailwind CSS    - Styling
```

---

## 🚀 DEPLOYMENT ARCHITECTURE

### Environment Configuration
```
Development (.env):
PORT=5002
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/wealth-tracker
JWT_SECRET=dev-secret-change-in-production
FRONTEND_URL=http://localhost:5173

Production (.env.production):
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/wealth-tracker
JWT_SECRET=[long-random-string]
FRONTEND_URL=https://yourdomain.com
```

### Recommended Deployment Stack
```
Frontend:
  - Vercel / Netlify (React app)
  - Custom domain
  - HTTPS

Backend:
  - Heroku / Railway / Render (Node.js)
  - Environment variables via platform
  - Application restart on errors

Database:
  - MongoDB Atlas (Cloud)
  - Automatic backups
  - Built-in security
```

---

## 📈 SCALABILITY CONSIDERATIONS

### Current Capacity
- ✅ Handles thousands of users
- ✅ Thousands of transactions per user
- ✅ Real-time budget tracking
- ✅ Sub-second analytics

### Future Scaling
- Cache layer (Redis) for analytics
- Message queue (RabbitMQ) for notifications
- CDN for static frontend assets
- Database replication for redundancy
- Microservices architecture (if needed)

---

**Document Version:** 1.0  
**Last Updated:** April 3, 2026  
**Status:** Production Ready
