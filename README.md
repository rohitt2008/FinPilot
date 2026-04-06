# 💸 FinPilot — Personal Finance Tracker (SaaS-Level)

> A full-stack, production-ready personal finance tracker with analytics, smart insights, and modern UI.

---

## 🚀 Live Demo

* 🌐 Frontend: https://fin-pilot-six.vercel.app
* ⚙️ Backend API: https://finpilot-fssl.onrender.com

---

## 🧠 Overview

FinPilot helps users:

* Track income & expenses
* Analyze spending patterns
* Get smart financial insights
* Export financial data
* Manage budgets effectively

Built with **scalable architecture + SaaS-level design principles**.

---

## 🏗️ System Architecture

```
           ┌───────────────┐
           │   Frontend    │
           │ React + Vite  │
           └──────┬────────┘
                  │ HTTPS (API Calls)
                  ▼
        ┌─────────────────────┐
        │   Backend Server    │
        │ Node + Express API  │
        └──────┬──────────────┘
               │
               ▼
        ┌─────────────────────┐
        │    MongoDB Atlas    │
        │  (Cloud Database)   │
        └─────────────────────┘
```

---

## ⚙️ Tech Stack

### 🖥️ Frontend

* React (Vite)
* Tailwind CSS
* Redux Toolkit
* Axios
* Chart.js

### 🧩 Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication

### ☁️ Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

## 🔐 Authentication Flow

```
User Login
   ↓
Frontend sends credentials → /api/auth/login
   ↓
Backend verifies user
   ↓
JWT token generated
   ↓
Token stored in localStorage
   ↓
All future requests include:
Authorization: Bearer <token>
```

---

## 📊 Core Features

### 💰 Transactions

* Add / Delete transactions
* Categorized (food, bills, etc.)
* Income vs Expense tracking

### 📈 Analytics Dashboard

* Income vs Expense Pie Chart
* Category-wise breakdown
* Real-time balance calculation

### 🧠 Smart Insights

* Spending behavior analysis
* Budget suggestions
* Expense warnings

### ⚠️ Budget Alerts

* Monthly budget tracking
* Overspending alerts

### 📤 Export Feature

* Export transactions as CSV

---

## 🧾 API Structure

### 🔑 Auth

```
POST /api/auth/register
POST /api/auth/login
```

### 💸 Transactions

```
GET    /api/transactions
POST   /api/transactions
DELETE /api/transactions/:id
GET    /api/transactions/export
```

### 📊 Analytics

```
GET /api/analytics
GET /api/analytics/smart-insights
```

### 💰 Budget

```
POST /api/budget
GET  /api/budget
```

---

## 🧩 Database Design

### 🧑 User

```
{
  _id,
  name,
  email,
  password
}
```

### 💸 Transaction

```
{
  userId,
  amount,
  type,        // income | expense
  category,
  description,
  createdAt
}
```

### 📊 Budget

```
{
  userId,
  amount,
  month
}
```

---

## 🔄 Data Flow

```
User Action (Frontend)
        ↓
Redux State Update
        ↓
API Request (Axios)
        ↓
Backend Controller
        ↓
MongoDB Query
        ↓
Response → UI Update
```

---

## 🎨 UI Highlights

* Clean SaaS dashboard
* Dark / Light mode
* Responsive design
* Animated charts
* Professional layout

---

## 🛡️ Security Features

* JWT-based authentication
* Protected routes
* Rate limiting
* Helmet (security headers)
* CORS protection

---

## ⚡ Performance Optimizations

* Pagination for transactions
* Efficient MongoDB queries
* Lazy rendering of charts
* Optimized API responses

---

## 🧪 Local Setup

### 1️⃣ Clone repo

```
git clone https://github.com/your-username/finpilot.git
cd finpilot
```

---

### 2️⃣ Backend setup

```
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
```

Run:

```
npm start
```

---

### 3️⃣ Frontend setup

```
cd frontend
npm install
```

Create `.env`:

```
VITE_API_URL=http://localhost:3000
```

Run:

```
npm run dev
```

---

## 🌍 Deployment Architecture

```
Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
```

---

## 🚀 Future Enhancements

* AI financial advisor
* Recurring transactions
* Multi-user sharing
* Mobile app
* Payment integrations

---

## 👨‍💻 Author

**Rohit**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
