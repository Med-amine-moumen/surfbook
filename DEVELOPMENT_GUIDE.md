# SurfBook Development Guide (SaaS Booking System)

Welcome to the official development guide for **SurfBook**, a full-stack SaaS booking system. This guide is designed for a team of 5 beginner-to-intermediate developers to rebuild this project completely from scratch.

## Tech Stack Overview
- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment/Tools:** Git, npm, ts-node-dev

---

## 1. Project Setup (Global)

First, we need to create the main project workspace that will hold both our frontend and backend.

### 1.1 Create the Root Directory
Open your terminal and run:
```bash
# Create the main project folder
mkdir surfbook
cd surfbook

# Create separate folders for frontend and backend
mkdir frontend backend
```

---

## 2. Backend Setup

The backend will serve as our RESTful API, handling database connections, authentication, and business logic.

### 2.1 Initialize Backend
```bash
cd backend

# Initialize a new Node.js project (creates package.json)
npm init -y
```

### 2.2 Install Dependencies
Install the required tools for building the server and connecting to MongoDB:
```bash
# Install core dependencies
npm install express mongoose cors dotenv jsonwebtoken bcryptjs zod stripe express-rate-limit

# Install development dependencies (TypeScript and types)
npm install -D typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs ts-node-dev
```

### 2.3 Setup TypeScript
```bash
# Initialize tsconfig.json
npx tsc --init
```
*Note: In `tsconfig.json`, ensure `"outDir": "./dist"` and `"rootDir": "./src"` are set.*

### 2.4 Create Folder Structure
```bash
# Create standard backend architecture folders
mkdir src
cd src
mkdir models routes middleware utils

# Create entry point and seed file
touch server.ts seed.ts
```

### 2.5 Setup Express Server & MongoDB Connection
Inside `backend/src/server.ts`, add the basic Express and MongoDB connection:

```typescript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/surfbook')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 3. Frontend Setup

The frontend will be a standalone Next.js 14 application communicating with our Express backend.

### 3.1 Initialize Next.js
Open a new terminal at the root of the `surfbook` folder:
```bash
# Navigate to the root directory
cd surfbook

# Create Next.js app inside the "frontend" folder (delete the empty dir first if it exists, or run inside it)
npx create-next-app@14 frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
*(When prompted by the Next.js CLI, select YES for TypeScript, Tailwind CSS, App Router, and `src/` directory).*

### 3.2 Frontend Folder Structure
```bash
cd frontend/src/app

# Create routing architecture
mkdir -p (login) (register) book/[slug] dashboard/bookings dashboard/customers dashboard/rooms dashboard/settings
```
*Note: We use Next.js App router file-system routing. Every folder needs a `page.tsx`.*

---

## 4. Feature Implementation (Step-by-Step)

### Step 1: Authentication System
1. **Backend:** Create `User.ts` model. Create `/api/auth/register` and `/api/auth/login` using `bcryptjs` for hashing passwords and `jsonwebtoken` for signing tokens.
2. **Backend:** Create `middleware/auth.ts` to decode JWTs and protect routes.
3. **Frontend:** Build Login and Register UI pages. Use Next.js React Context structure to map the logged-in user globally.

### Step 2: Database Models & Architecture
Inside `backend/src/models/`, create the following Mongoose schemas:
- `Company.ts`: Holds company settings and public slug (e.g., `company-name`).
- `Room.ts`: Holds inventory (name, capacity, price per night).
- `Customer.ts`: Guest information.
- `Booking.ts`: Core feature (check-in, check-out, statuses, price, foreign keys to Room and Customer).

### Step 3: Booking System & Room Availability Logic
1. Create `routes/bookings.ts`.
2. **Availability Logic:** Before creating a booking, write a query to find overlapping bookings for the selected `roomId` and `checkIn`/`checkOut` dates. If overlap exists, reject the booking.
3. Create the public booking flow on the frontend at `/book/[slug]`.

### Step 4: Dashboard Features
1. Create `/api/dashboard/stats` to aggregate total revenue, occupancy rate, and active bookings.
2. In the Next.js `dashboard/` layout, setup protected routes that fetch data using `useEffect` or React Query and display tables (Bookings Table, Customers Table).

---

## 5. Database Setup & Seeding

Since it's a SaaS, you need initial data config.

### 5.1 Environment variables
In `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/surfbook
JWT_SECRET=super_secret_jwt_key_here
```

### 5.2 Seeding Script
Create a script in `backend/src/seed.ts` to populate fake initial data for testing.
```bash
# Add to package.json scripts:
"seed": "ts-node src/seed.ts"

# Run it
npm run seed
```

---

## 6. Team Workflow (For 5 Developers)

To build this simultaneously without overlapping, use the following roles:

- **Developer 1 (Tech Lead / DevOps):** 
  - Sets up the GitHub repo, folder structures, and `package.json`.
  - Configures TypeScript, ESLint, and Next.js setup.
  - Manages the Git workflow and Code Reviews.
- **Developer 2 (Backend Core & Auth):**
  - Builds `User`, `Company` models.
  - Implements Login/Register endpoints and Security JWT Middleware.
- **Developer 3 (Backend API & Logic):**
  - Builds `Room`, `Booking`, `Customer` models.
  - Writes complex aggregation logic (Room Availability, Dashboard stats).
- **Developer 4 (Frontend Config & Dashboard UI):**
  - Builds the Dashboard Layout, Sidebar, and Tables mapping frontend to backend APIs.
  - Handles the complex states of updating Bookings.
- **Developer 5 (Frontend Public & Booking Flow):**
  - Builds the Landing Page and the `/book/[slug]` public booking flow.
  - Integrates Stripe checkout logic UI.

### 6.1 Git Workflow Strategy
Always use feature branches. **NEVER push directly to `main`.**
```bash
# 1. Update your local main
git checkout main
git pull origin main

# 2. Create a new branch for your specific feature
git checkout -b feature/auth-system

# 3. Work on your code, then add and commit
git add .
git commit -m "feat: implement JWT token generation"

# 4. Push and create a Pull Request on GitHub
git push origin feature/auth-system
```

---

## 7. Best Practices & Conventions

### 7.1 Separation of Concerns
- **Backend:** Keep Routes clean. Put complex logic in controllers or service layers. Models should only define schema.
- **Frontend:** Extract repetitive UI into a `components/` folder (e.g., `Button.tsx`, `Modal.tsx`, `Table.tsx`).

### 7.2 Naming Conventions
- **Files/Folders:**
  - Frontend standard components: `PascalCase.tsx` (e.g. `Navbar.tsx`).
  - Next.js routing files are explicitly lowercase: `page.tsx`, `layout.tsx`.
  - Backend files: `camelCase.ts` or `kebab-case.ts` (e.g. `authMiddleware.ts`).
  - Backend Models explicitly: `PascalCase.ts` (e.g. `User.ts`, `Booking.ts`).
- **Variables/Functions:** `camelCase` (e.g. `fetchBookings`, `currentUser`).

### 7.3 Clean Code Tips
- Do not use `any` type in TypeScript. Create an `index.ts` in `types/` folder and define your interfaces.
- Hardcode nothing: Use `.env` variables for URLs, Ports, and Secret Keys.
- Handle all `try/catch` block errors so the server never crashes.
- Make API requests dynamic by creating a reusable `apiClient.ts` custom fetcher that automatically attaches the JWT Bearer token to headers.