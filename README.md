# 🌟 Lumina CRM - Client Lead Management System

A modern, full-stack Customer Relationship Management (CRM) system built with React, TypeScript, Node.js, Express, and PostgreSQL. Manage leads, track interactions, analyze performance, and streamline your sales pipeline.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 📊 Dashboard & Analytics
- **Real-time Statistics** - Total leads, conversion rates, and pipeline value
- **Visual Charts** - Lead distribution by status and source
- **Performance Metrics** - Track conversion rates and sales trends
- **Quick Actions** - Fast access to common tasks

### 👥 Lead Management
- **Complete CRUD Operations** - Create, read, update, and delete leads
- **Status Workflow** - Track leads through: New → Contacted → Converted
- **Advanced Search & Filtering** - Find leads by name, email, status, or source
- **Lead Details** - Comprehensive view with contact info, company, and history
- **Bulk Operations** - Manage multiple leads efficiently

### 📝 Notes & Communication
- **Lead Notes** - Add timestamped notes to any lead
- **Activity Timeline** - Track all interactions chronologically
- **Communication History** - Keep detailed records of all touchpoints

### 🔐 Authentication & Security
- **JWT Authentication** - Secure token-based login (24-hour expiry)
- **Protected Routes** - Role-based access control
- **Password Encryption** - Bcrypt hashing for secure storage
- **Session Management** - Persistent login with localStorage

### 🎨 User Interface
- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Dark Mode Support** - Toggle between light and dark themes
- **Toast Notifications** - Real-time feedback for all actions
- **Loading States** - Smooth UX with loading indicators

### 📈 Analytics & Reporting
- **Lead Analytics** - Comprehensive statistics and insights
- **Status Distribution** - Visual breakdown of pipeline stages
- **Source Tracking** - Monitor lead generation channels
- **Conversion Metrics** - Calculate and display conversion rates

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Lucide Icons** - Beautiful icon library
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **PostgreSQL** - Relational database (Supabase)
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **PostgreSQL** database - [Supabase](https://supabase.com/) (free tier available)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lumina-crm
```

### 2. Database Setup (Supabase)

1. Create a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. Go to **Settings** → **Database** and note your connection details
4. Run the following SQL in the Supabase SQL Editor:

```sql
-- Create leads table
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

-- Create notes table
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert admin user (password: "password")
INSERT INTO admin_users (email, password) 
VALUES ('admin@lumina.com', 'LuminaCrm@Admin2026!');
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Create .env file
# Copy the following and replace with your Supabase credentials
```

Create `backend/.env`:
```env
DB_HOST=db.YOUR_PROJECT_REF.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=YOUR_DATABASE_PASSWORD
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
```

```bash
# Test database connection
node test-db.js

# Import sample leads (optional)
node import-leads.js

# Start the backend server
node server.js
```

The backend will run on **http://localhost:5001**

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ..

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend will run on **http://localhost:3000**

### 5. Login

Open your browser and navigate to **http://localhost:3000**

**Default Admin Credentials:**
- Email: `admin@lumina.com`
- Password: `LuminaCrm@Admin2026!`

## 📁 Project Structure

```
lumina-crm/
├── backend/                    # Backend API
│   ├── config/
│   │   └── database.js        # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── leadController.js  # Lead CRUD operations
│   │   └── noteController.js  # Notes management
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── leadRoutes.js      # Lead endpoints
│   │   └── noteRoutes.js      # Note endpoints
│   ├── .env                   # Environment variables
│   ├── server.js              # Main server file
│   ├── test-db.js             # Database test script
│   ├── import-leads.js        # Import sample data
│   └── package.json
│
├── src/                        # Frontend source
│   ├── components/            # Reusable components
│   ├── context/               # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   ├── LeadContext.tsx    # Lead management state
│   │   ├── ThemeContext.tsx   # Theme management
│   │   └── ToastContext.tsx   # Notifications
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Leads.tsx          # Leads management
│   │   ├── Analytics.tsx      # Analytics page
│   │   ├── Login.tsx          # Login page
│   │   └── Settings.tsx       # Settings page
│   ├── types.ts               # TypeScript types
│   ├── App.tsx                # Main app component
│   └── index.tsx              # Entry point
│
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Public Endpoints (No Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/leads` - Create lead (contact form)

### Protected Endpoints (Requires JWT Token)
- `GET /api/leads` - Get all leads
- `GET /api/leads/search` - Search/filter leads
- `GET /api/leads/analytics` - Get analytics data
- `GET /api/leads/:id` - Get single lead
- `PUT /api/leads/:id` - Update lead
- `PUT /api/leads/:id/status` - Update lead status
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/notes/lead/:leadId` - Get notes for lead
- `POST /api/notes/lead/:leadId` - Add note to lead
- `DELETE /api/notes/:id` - Delete note

## 🎯 Usage Guide

### Adding a Lead
1. Navigate to **Leads** page
2. Click **"Add Lead"** button
3. Fill in the form (name and email required)
4. Click **"Save"**
5. Lead is saved to database

### Updating Lead Status
1. Open a lead's details
2. Click on the status dropdown
3. Select new status (new, contacted, converted)
4. Status updates automatically

### Adding Notes
1. Open a lead's details
2. Scroll to the notes section
3. Type your note in the text area
4. Click **"Add Note"**
5. Note is saved with timestamp

### Searching Leads
1. Go to **Leads** page
2. Use the search bar to filter by name/email
3. Use status/source filters for advanced filtering
4. Results update in real-time

### Viewing Analytics
1. Navigate to **Analytics** page
2. View conversion rates and statistics
3. Analyze lead distribution charts
4. Track performance metrics

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Test database connection
node test-db.js

# Test API endpoints
node test-api.js

# Verify imported leads
node verify-leads.js
```

### Manual Testing
1. Login with admin credentials
2. Create a new lead
3. Refresh the page - lead should persist
4. Update lead status
5. Add a note
6. Check database to verify changes

## 🔧 Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env`
- Check if Supabase project is active
- Ensure firewall allows connections
- Try flushing DNS: `ipconfig /flushdns`

### Frontend Not Loading Leads
- Check if backend server is running on port 5001
- Verify you're logged in (check localStorage for token)
- Open browser console for error messages
- Check network tab for failed API calls

### Authentication Errors
- Ensure JWT_SECRET is set in backend `.env`
- Check token hasn't expired (24h validity)
- Clear localStorage and login again
- Verify admin user exists in database

## 📝 Environment Variables

### Backend (.env)
```env
DB_HOST=           # Supabase database host
DB_PORT=5432       # PostgreSQL port
DB_NAME=postgres   # Database name
DB_USER=postgres   # Database user
DB_PASSWORD=       # Your database password
JWT_SECRET=        # Secret key for JWT tokens
PORT=5000          # Backend server port
```

## 🚢 Deployment

### Backend Deployment
- Deploy to **Heroku**, **Railway**, or **Render**
- Set environment variables
- Ensure PostgreSQL database is accessible
- Update CORS settings for production domain

### Frontend Deployment
- Build: `npm run build`
- Deploy to **Vercel**, **Netlify**, or **GitHub Pages**
- Update API_URL in `context/LeadContext.tsx` and `context/AuthContext.tsx`
- Configure environment variables

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for efficient lead management

## 🙏 Acknowledgments

- React team for the amazing framework
- Supabase for the database platform
- Lucide for the beautiful icons
- All contributors and users

---

**Need Help?** Check the [troubleshooting guide](backend/README.md) or open an issue.

**Happy Lead Managing! 🚀**
