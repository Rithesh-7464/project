# Event Management Project - Setup Guide

## Prerequisites
- Node.js installed
- PostgreSQL installed and running
- Git (optional)

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Database
```bash
# Using psql
psql -U postgres

# Create database
CREATE DATABASE event_management;

# Connect to the database
\c event_management

# Run the initialization script
\i init.sql
```

Alternatively, run directly:
```bash
psql -U postgres -d event_management -f init.sql
```

### 3. Configure Environment Variables
Edit `backend/.env` with your PostgreSQL credentials:
```
DATABASE_URL=postgresql://username:password@localhost:5432/event_management
PORT=5000
```

**Example for default PostgreSQL:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/event_management
PORT=5000
```

### 4. Start Backend Server
```bash
npm start
```

You should see: `Server running on port 5000`

## Frontend Setup

The frontend is already configured to use the local backend. Just open `index.html` in a browser.

**For local testing:**
- Use a local server or open the file directly if the backend is running on `http://localhost:5000`

### Update API URL (if needed)
Edit `script.js` line 1:
```javascript
const API_URL = "http://localhost:5000"; // For local development
```

## Testing
1. Start the backend server
2. Open `index.html` in your browser
3. Events should load from the database
4. You can register for events

## Troubleshooting

### Events not loading
- Check if backend is running on port 5000
- Verify DATABASE_URL in `.env`
- Check browser console for error messages

### Registration fails
- Verify the event exists in the database
- Check all form fields are filled
- Look for errors in backend console

### Database connection refused
- Ensure PostgreSQL is running
- Check username/password in DATABASE_URL
- Verify database name is correct

## Database Schema

**events table:**
- id (Primary Key)
- title
- date
- category
- venue
- description
- created_at

**registrations table:**
- id (Primary Key)
- student_name
- email
- event_id (Foreign Key to events)
- created_at
