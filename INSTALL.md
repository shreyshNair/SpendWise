# 🛠️ SpendWise - Setup & Running Guide

To run this application successfully, you need to follow these steps precisely from your terminal.

### 1. Prerequisites
- **Node.js** (v18 or higher) installed on your system.
- **PostgreSQL** instance running either locally or via a cloud provider like [Supabase](https://supabase.com).

### 2. Database Configuration
Open `server/.env` and ensure the `DATABASE_URL` matches your PostgreSQL connection string. 
Example (Supabase):
```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:5432/postgres"
JWT_SECRET="EnterARandomStringForSecurity123"
```

### 3. Server Setup (Run from root)
The reason your previous command failed is because it was run in the root folder instead of the `server` folder. Use these commands:

```powershell
# Navigate to server and install dependencies
cd server
npm install

# Apply database schema and generate Prisma client
npx prisma generate
npx prisma migrate dev --name init

# Seed initial demo data (Optional)
npx ts-node prisma/seed.ts

# Start the server
npm run dev
```

### 4. Client Setup (Open a NEW terminal window)
```powershell
# Navigate to client and install dependencies
cd client
npm install

# Start the frontend
npm run dev
```

### 5. Access the App
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:5173`
- **Login Credentials**: `demo@spendwise.com` / `password123`

---

> [!TIP]
> If you don't have PostgreSQL installed and want to try the app immediately, ask me to **"Switch to SQLite"** and I will reconfigure the app to work without any database setup!
