# 🚀 WEALTH TRACKER - QUICK START GUIDE

**Status:** ✅ Ready to Run  
**Last Updated:** April 3, 2024

---

## ⚡ 5-MINUTE SETUP

### Step 1: Prerequisites
```bash
# Make sure you have:
- Node.js 16+ (download from nodejs.org)
- MongoDB running locally
- Git (optional)
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd wealth-tracker/backend
npm install
```

**Frontend:**
```bash
cd wealth-tracker/frontend
npm install
```

### Step 3: Configure Environment

**Backend .env** (already created at `backend/.env`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/wealth-tracker
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start Services

**Terminal 1 - MongoDB** (if not already running):
```bash
# Linux/Mac
mongod

# Windows (if installed)
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Step 5: Test the App
1. Open http://localhost:5173
2. Click "Register here"
3. Create account with:
   - Name: John Doe
   - Email: john@example.com
   - Password: Password123 (8+ chars)
   - Confirm: Password123
4. Click Register → Auto-redirects to Login
5. Login with email & password
6. You're in! 🎉

---

## 📱 WHAT YOU CAN DO NOW

- ✅ Add Income sources
- ✅ Track Expenses
- ✅ Set Monthly Budgets
- ✅ Create Financial Goals
- ✅ View Analytics & Summary
- ✅ See Category Spending
- ✅ Track Goal Progress

---

## 🧪 TEST TRANSACTION

1. Go to **Transactions** in navbar
2. Add Transaction:
   - Type: Expense
   - Category: Food
   - Amount: 50
   - Notes: Lunch
3. Click "Add Transaction"
4. See it in table below
5. Click "Delete" to remove

---

## 📊 TEST ANALYTICS

1. Click **Analytics** in navbar
2. View:
   - Total income & expenses
   - Monthly breakdown
   - Category spending
   - Budget status
   - Goal progress

---

## 🚨 COMMON ISSUES

### MongoDB Won't Connect
```
Make sure MongoDB is running:
mongod
```

### Port 5000 Already in Use
```
Either:
1. Change PORT to 5001 in backend/.env
2. Or kill process: lsof -i :5000 | kill -9 <PID>
```

### Frontend Can't Connect to Backend
```
Check VITE_API_URL is correct in frontend/.env.local
Should be: http://localhost:5000/api
```

### Login Fails
```
1. Double-check email & password
2. Make sure MongoDB is connected
3. Check backend has no errors
```

---

## 📚 DOCUMENTATION

- **SETUP_AND_TESTING.md** - Complete API testing guide
- **FINAL_AUDIT_REPORT.md** - What was fixed & built
- **.env.example** - Configuration reference

---

## 🎯 NEXT STEPS

### To Expand Features:
1. Review `FINAL_AUDIT_REPORT.md` for what's implemented
2. Check `SETUP_AND_TESTING.md` for API endpoints
3. Add new features to backend controllers
4. Update frontend components

### To Deploy:
1. Update JWT_SECRET to secure random string
2. Use production MongoDB connection
3. Set NODE_ENV=production
4. Deploy backend to server
5. Build & deploy frontend
6. Update API URL in environment

---

## 💡 TIPS

- Transactions can be expense OR income
- Budgets are per category per month
- Goals need future deadline dates
- Analytics show current month + all-time stats
- All validation is done client & server-side

---

## 📞SUPPORT

If something doesn't work:
1. Check MongoDB is running
2. Check both servers are running
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check browser console for errors (F12)
5. Check network tab to see API responses
6. Review error messages in the app

---

**ENJOY YOUR WEALTH TRACKER!** 🎉
