# 🚀 Quick Start Guide - Lumina CRM

Get up and running with Lumina CRM in 5 minutes!

## ⚡ Prerequisites

- Node.js installed
- Supabase account (free)

## 📝 Step-by-Step Setup

### 1️⃣ Database Setup (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and run this:

```sql
-- Create tables
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  company VARCHAR,
  source VARCHAR DEFAULT 'Website',
  message TEXT,
  status VARCHAR DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin user
INSERT INTO admin_users (email, password) 
VALUES ('admin@lumina.com', 'password');
```

4. Go to **Settings** → **Database** and copy your connection details

### 2️⃣ Backend Setup (1 minute)

```bash
cd backend

# Create .env file with your Supabase credentials
# DB_HOST=db.YOUR_PROJECT.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=YOUR_PASSWORD
# JWT_SECRET=your_secret_key
# PORT=5000

# Start backend
node server.js
```

### 3️⃣ Frontend Setup (1 minute)

```bash
# In a new terminal, from project root
npm run dev
```

### 4️⃣ Login (30 seconds)

1. Open http://localhost:3000
2. Login with:
   - Email: `admin@lumina.com`
   - Password: `password`

### 5️⃣ Import Sample Data (Optional)

```bash
cd backend
node import-leads.js
```

## ✅ You're Done!

Your CRM is now running with:
- ✅ Backend API on http://localhost:5001
- ✅ Frontend on http://localhost:3000
- ✅ Database connected to Supabase
- ✅ Sample data loaded (if imported)

## 🎯 Next Steps

1. **Add a lead** - Click "Add Lead" button
2. **Update status** - Change lead from "new" to "contacted"
3. **Add notes** - Track interactions with leads
4. **View analytics** - Check your conversion rates

## 🆘 Troubleshooting

**Can't connect to database?**
- Run `ipconfig /flushdns` (Windows)
- Check Supabase credentials in `.env`

**Frontend not loading leads?**
- Make sure backend is running on port 5001
- Check browser console for errors
- Verify you're logged in

**Need help?** Check the full [README.md](README.md) for detailed documentation.

---

**Happy Lead Managing! 🚀**
