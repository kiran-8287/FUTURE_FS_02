# Lumina CRM Backend

Complete backend API for the Lumina Client Lead Management System built with Node.js, Express, and PostgreSQL (Supabase).

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase PostgreSQL database

### Installation

1. **Install dependencies** (already done):
```bash
npm install
```

2. **Configure environment variables**:
The `.env` file is already configured with your Supabase credentials.

3. **Start the server**:
```bash
node server.js
```

The server will run on `http://localhost:5001`

## 📁 Project Structure

```
backend/
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Project dependencies
├── server.js                     # Main entry point
├── config/
│   └── database.js               # Database connection configuration
├── middleware/
│   └── auth.js                   # JWT authentication middleware
├── routes/
│   ├── authRoutes.js             # Authentication routes
│   ├── leadRoutes.js             # Lead management routes
│   └── noteRoutes.js             # Notes management routes
└── controllers/
    ├── authController.js         # Authentication logic
    ├── leadController.js         # Lead management logic
    └── noteController.js         # Notes management logic
```

## 🔐 Environment Variables

```env
DB_HOST=db.vrqbatdytpuflgewhcnk.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=SaiKiran8287
JWT_SECRET=lumina_crm_secret_key_2026
PORT=5000
```

## 📊 Database Schema

### Table: leads
- `id` (int8, primary key, auto increment)
- `name` (varchar)
- `email` (varchar)
- `phone` (varchar, nullable)
- `company` (varchar, nullable)
- `source` (varchar, default: "Website")
- `message` (text, nullable)
- `status` (varchar, default: "new") → values: new, contacted, converted
- `created_at` (timestamptz, default: now())

### Table: notes
- `id` (int8, primary key, auto increment)
- `lead_id` (int8, foreign key → leads.id)
- `note_text` (text)
- `created_at` (timestamptz, default: now())

### Table: admin_users
- `id` (int8, primary key, auto increment)
- `email` (varchar) → admin@lumina.com
- `password` (varchar) → password
- `created_at` (timestamptz)

## 🛣️ API Endpoints

### Public Endpoints (No Authentication Required)

#### Authentication
- **POST** `/api/auth/login` - Admin login
  ```json
  Request:
  {
    "email": "admin@lumina.com",
    "password": "password"
  }
  
  Response:
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "admin@lumina.com"
    }
  }
  ```

#### Lead Submission
- **POST** `/api/leads` - Submit new lead (public contact form)
  ```json
  Request:
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "source": "Website",
    "message": "Interested in your services"
  }
  
  Response: (201 Created)
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "source": "Website",
    "message": "Interested in your services",
    "status": "new",
    "created_at": "2026-02-01T06:08:04.000Z"
  }
  ```

### Protected Endpoints (Require Authentication)

**Authentication Header Required:**
```
Authorization: Bearer <jwt_token>
```

#### Lead Management

- **GET** `/api/leads` - Get all leads
  ```json
  Response:
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "status": "new",
      ...
    }
  ]
  ```

- **GET** `/api/leads/:id` - Get single lead by ID
  ```json
  Response:
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
  ```

- **GET** `/api/leads/search?query=john&status=new&source=Website` - Search/filter leads
  - Query params: `query` (name/email), `status`, `source`

- **GET** `/api/leads/analytics` - Get analytics data
  ```json
  Response:
  {
    "total": 100,
    "new": 45,
    "contacted": 30,
    "converted": 25,
    "conversionRate": 25.00
  }
  ```

- **PUT** `/api/leads/:id` - Update lead details
  ```json
  Request:
  {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567890",
    "company": "New Company",
    "source": "Referral",
    "message": "Updated message"
  }
  ```

- **PUT** `/api/leads/:id/status` - Update lead status
  ```json
  Request:
  {
    "status": "contacted"
  }
  ```

- **DELETE** `/api/leads/:id` - Delete a lead
  ```json
  Response:
  {
    "message": "Lead deleted successfully",
    "deletedLead": { ... }
  }
  ```

#### Notes Management

- **GET** `/api/notes/lead/:leadId` - Get all notes for a lead
  ```json
  Response:
  [
    {
      "id": 1,
      "lead_id": 1,
      "note_text": "Called customer, interested in demo",
      "created_at": "2026-02-01T06:08:04.000Z"
    }
  ]
  ```

- **POST** `/api/notes/lead/:leadId` - Add note to a lead
  ```json
  Request:
  {
    "note_text": "Follow up scheduled for next week"
  }
  
  Response: (201 Created)
  {
    "id": 2,
    "lead_id": 1,
    "note_text": "Follow up scheduled for next week",
    "created_at": "2026-02-01T06:08:04.000Z"
  }
  ```

- **DELETE** `/api/notes/:id` - Delete a note
  ```json
  Response:
  {
    "message": "Note deleted successfully",
    "deletedNote": { ... }
  }
  ```

### Health Check

- **GET** `/api/health` - Server health check
  ```json
  Response:
  {
    "message": "Server is running!",
    "timestamp": "2026-02-01T06:08:04.000Z"
  }
  ```
  ```bash
  curl -X GET http://localhost:5001/api/health
  ```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication for protected routes
- **Password Support**: Supports both plain text and bcrypt hashed passwords
- **SQL Injection Prevention**: All queries use parameterized statements
- **CORS Enabled**: Cross-origin requests allowed for frontend integration
- **Environment Variables**: Sensitive data stored in `.env` file

## 🧪 Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lumina.com","password":"LuminaCrm@Admin2026!"}'
```

**Create Lead (Public):**
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890","company":"Test Co","source":"Website","message":"Test message"}'
```

**Get All Leads (Protected):**
```bash
curl -X GET http://localhost:5000/api/leads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman or Thunder Client

1. **Login** to get JWT token
2. **Copy the token** from response
3. **Add Authorization header** to protected requests:
   - Type: Bearer Token
   - Token: `<paste_your_token>`

## 🚨 Error Handling

All endpoints return appropriate HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (no token or invalid credentials)
- **403** - Forbidden (invalid/expired token)
- **404** - Not Found
- **500** - Internal Server Error

Error response format:
```json
{
  "error": "Error message here"
}
```

## 📝 Admin Credentials

**Email:** admin@lumina.com  
**Password:** LuminaCrm@Admin2026!

## 🔄 Integration with Frontend

The backend is configured to work with a frontend running on `http://localhost:3000`. CORS is enabled for all origins.

To connect from frontend:
1. Use the login endpoint to get JWT token
2. Store token in localStorage or state management
3. Include token in Authorization header for protected requests
4. Handle token expiration (24 hours)

## 🛠️ Development

### Running in Development Mode

```bash
node server.js
```

### Recommended: Use nodemon for auto-restart

```bash
npm install -g nodemon
nodemon server.js
```

## 📦 Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **cors** - CORS middleware
- **dotenv** - Environment variable management
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env`
- Check if Supabase instance is running
- Ensure SSL is properly configured
- Check network connectivity

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Check token format in Authorization header
- Ensure token hasn't expired (24h validity)

### Port Already in Use
```bash
# Change PORT in .env file or kill the process using port 5000
```

## 📄 License

This project is part of the Lumina CRM system.

---

**Backend URL:** http://localhost:5001  
**Frontend URL:** http://localhost:3000  
**Database:** Supabase PostgreSQL
