# SpendWise 💰
### **Premium Personal Finance & Savings Intelligence Platform**

SpendWise is a sophisticated full-stack application designed to provide users with deep visibility into their financial health. With automated insights, goal tracking, and a premium dark-mode UI, it empowers users to take control of their spending and maximize their savings.

---

## 🖼️ Visual Showcase
*A glimpse of the premium SpendWise interface.*

| Dashboard | Dark Mode Insights |
|-----------|------------------|
| ![Dashboard Preview](docs/assets/lightMode.png) | ![Dark Mode Preview](docs/assets/darkMode.png) |

---

## ✨ Key Features
- **📊 Intelligence Dashboard**: Real-time visualization of monthly income vs. expenses with interactive charts.
- **🌓 Dynamic Dark Mode**: Premium dark theme integration across all pages with smart state persistence.
- **📥 Smart Transaction Entry**: Categorized recording of daily expenses and recurring income streams.
- **🎯 Precise Savings Goals**: Set monthly targets and monitor your progress with real-time feedback.
- **💡 AI-Powered Insights**: Personalized recommendations for budget optimization based on spending patterns (requires historical data comparison).
- **🔒 Secure Architecture**: Self-hosted JWT-based authentication with bcrypt hashing, removing dependency on external auth providers (Supabase).

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Zustand (State Management), Recharts.
- **Backend**: Node.js, Express, TypeScript.
- **ORM & DB**: Prisma with **MongoDB Atlas** (Flexible document storage for varied financial tracking).
- **Date Management**: `date-fns` for precise temporal calculations and multi-month comparison.

---

## 📂 Project Structure
```text
SpendWise/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Theme-aware UI components
│   │   ├── pages/       # Dashboard, Expenses, Goals, etc.
│   │   ├── store/       # Zustand theme and auth stores
│   │   └── services/    # Axios API client
├── server/              # Express + Prisma backend
│   ├── prisma/          # MongoDB schema (schema.prisma)
│   ├── src/
│   │   ├── controllers/ # Goal logic, analytics, and transaction handlers
│   │   ├── middleware/  # JWT validation and protected route logic
│   │   └── routes/      # REST API endpoints
```

---

## 🚀 Local Setup Guide

### 1. Database Setup
Create a **MongoDB Atlas** cluster (Free Tier) and ensure you have your connection string. Set your variables in `server/.env`:
```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/spendwise?retryWrites=true&w=majority"
JWT_SECRET="your-secure-jwt-secret-key"
```

### 2. Backend Initialization
```bash
cd server
npm install
npx prisma generate
# Sync schema with MongoDB Atlas (MongoDB uses db push instead of migrations)
npx prisma db push
npm run dev
```

### 3. Frontend Initialization
```bash
cd client
npm install
# Configure API URL in .env
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

---

## 🗄️ Database Management
The application uses **Prisma** as its primary data layer. Since moving to MongoDB, you can use Prisma Studio to manage your documents visually:

```bash
cd server
npx prisma studio
```
This tool allows you to directly edit Users, Expenses, Incomes, and Savings Goals. Note that Savings Goals are tracked monthly and updated via the `upsert` pattern in the controller.

---

## 🌐 Deployment via Vercel

SpendWise is optimized for deployment on **Vercel**.

### **Backend (Express API)**
1.  Connect your repository to Vercel.
2.  Set the **Root Directory** to `server`.
3.  Add the following **Environment Variables**:
    -   `DATABASE_URL`: Your MongoDB cluster URL.
    -   `JWT_SECRET`: Production secret.
4.  Vercel will detect the `vercel.json` if present in the root.

### **Frontend (React)**
1.  Set the **Root Directory** to `client`.
2.  Set the **Build Command** to `npm run build`.
3.  Set the **Output Directory** to `dist`.
4.  Add the environment variable:
    -   `VITE_API_URL`: The URL of your deployed backend.

---

## 📄 License
Released under the MIT License. Designed for personal excellence.