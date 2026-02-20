# Micro Marketplace App

A full-stack Micro Marketplace application with Web (React) and Mobile (React Native/Expo) support. The backend is built with Node.js, Express, and MongoDB.

## Project Structure

```
.
├── backend/          # Node.js + Express API
├── web/              # React Web App (Vite)
└── mobile/           # React Native (Expo)
```

## Features

### Backend (Node.js + Express + MongoDB)
- JWT Authentication (Register/Login)
- Products CRUD with search and pagination
- Favorites management (Add/Remove)
- Password hashing with bcrypt
- Input validation with express-validator

### Web App (React + Vite)
- Clean, responsive UI
- Login/Register pages with animations (Framer Motion)
- Product listing with search + pagination
- Product detail page
- Favorites functionality
- Creative UI elements (animations, hover effects)

### Mobile App (React Native + Expo)
- Login/Register screens
- Browse products with search
- Product detail view
- Add/Remove favorites
- Bottom tab navigation

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start MongoDB and run the server:

```bash
# Start MongoDB (if local)
mongod

# Run the backend server
npm start

# Seed database with test data (in separate terminal)
npm run seed
```

### 2. Web App Setup

```bash
cd web
npm install
npm run dev
```

The web app will be available at `http://localhost:5173`

### 3. Mobile App Setup

```bash
cd mobile
npm install
npm start
```

This will start the Expo development server. Use Expo Go on your device or emulator to run the app.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (supports search & pagination) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (auth required) |
| PUT | `/api/products/:id` | Update product (auth required) |
| DELETE | `/api/products/:id` | Delete product (auth required) |

Query parameters for GET `/api/products`:
- `search` - Search by title/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user favorites |
| POST | `/api/favorites/:productId` | Add to favorites |
| DELETE | `/api/favorites/:productId` | Remove from favorites |
| GET | `/api/favorites/check/:productId` | Check if product is favorite |

## Test Credentials

After running the seed script:

| Email | Password |
|-------|----------|
| john@example.com | password123 |
| jane@example.com | password123 |

## Seeded Products

The database includes 10 products across categories:
- Electronics (3 products)
- Fashion (1 product)
- Food & Beverages (2 products)
- Home & Living (1 product)
- Photography (1 product)
- Sports (2 products)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Web
- React with Vite
- React Router for navigation
- Framer Motion for animations
- CSS for styling

### Mobile
- React Native with Expo
- Expo Router for navigation
- React Navigation

## Notes

- The backend runs on port 5000
- The web app runs on port 5173 (Vite default)
- The mobile app uses Expo and can run on iOS/Android/Web
- MongoDB must be running before starting the backend
