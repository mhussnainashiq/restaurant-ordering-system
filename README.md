# SavorHub – Restaurant Ordering System

A full-stack restaurant ordering platform with online menu, shopping cart, checkout, order tracking, authentication, promo codes, and a complete admin dashboard.

Built as a professional portfolio project.

---

## Features

### Customer Side
- Modern homepage with hero, categories, and featured dishes
- Full menu with search, category filter, price filter, vegetarian filter, and sorting
- Food details page with quantity selector
- Persistent shopping cart (localStorage)
- Checkout with delivery / pickup options
- Promo code support
- Order confirmation page
- Order history and visual order tracking timeline
- Reorder previous orders
- User authentication (Signup / Login / Logout)
- Account profile management
- Currency support (USD / PKR)

### Admin Side
- Protected admin dashboard with statistics
- Menu management (Add, Edit, Delete, Availability toggle)
- Order management with status updates
- Customer management
- Offers & Promo code management
- Restaurant settings (name, contact, delivery fee, tax, currency, opening hours)

---

## Tech Stack

**Frontend**
- React.js (Vite)
- React Router DOM
- Context API
- Lucide React (icons)
- Modern CSS (no Tailwind)

**Backend** (ready structure)
- Node.js + Express.js
- MongoDB + Mongoose (connection ready)
- JWT + bcrypt (prepared)

**Other**
- localStorage for current data persistence
- Git + GitHub ready

---

## Project Structure

restaurant-ordering-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── ...
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── .gitignore
└── README.md


---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm
- Git

### Clone the repository
```bash

cd restaurant-ordering-system


### Frontend Setup

Bashcd client
npm install
npm run dev

### cd server
npm install
npm run dev

Backend runs on: http://localhost:5000


### Environment Variables


envPORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string


