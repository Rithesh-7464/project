# Event Management Project - Setup Guide

## Prerequisites
- Node.js installed
- Backend should be running

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database (IMPORTANT - Do this first!)
```bash
npm run setup
```

This script will:
- Create the database on Render.com
- Create the `events` and `registrations` tables
- Add sample event data
- Create necessary indexes

**Output should show:**
```
✓ Database 'project_db_gbn8t' created
✓ Events table created
✓ Registrations table created
✓ Index created
✓ Sample data inserted
✓ Database setup completed successfully!
```

### 3. Start Backend Server
```bash
npm start
```

You should see: `Server running on port 5000`

## Frontend Setup

The frontend is configured to auto-detect the environment:
- **Local development** (localhost): Uses `http://localhost:5000`
- **Production** (deployed): Uses `https://project-o2h0.onrender.com`

Just open `index.html` in your browser and it will work!

## Quick Start

1. **Terminal 1** - Setup database (one-time):
   ```bash
   cd backend
   npm run setup
   ```

2. **Terminal 2** - Start backend:
   ```bash
   cd backend
   npm start
   ```

3. **Open `index.html`** in your browser
   - You should see the 3 sample events
   - You can register for events
   - Registrations appear in the "Registrations" section

## What Was Fixed

✅ **Database not found** - Created missing Render PostgreSQL database  
✅ **Tables don't exist** - Auto-created schema on startup  
✅ **Events not loading** - Fixed DATABASE_URL environment loading  
✅ **Registration failing** - Tables and relationships now working  
✅ **Auto-detection** - Frontend now uses localhost for dev, Render for production  

## Troubleshooting

### Events still not loading?
- Check if backend is running: `curl http://localhost:5000/`
- Check if setup script ran successfully: `npm run setup`
- Look for errors in backend terminal

### "Cannot find module dotenv" error?
- Run: `npm install`

### Port 5000 already in use?
- Edit `.env` and change `PORT=5000` to another port like `PORT=3001`
- Update frontend API_URL if needed

### Database connection errors?
- Verify `.env` file has DATABASE_URL
- The DATABASE_URL should contain your Render.com PostgreSQL credentials
- Re-run: `npm run setup`

## Files Structure

```
backend/
├── .env                 # Environment variables (DATABASE_URL, PORT)
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── server.js           # Express backend server
├── db.js               # PostgreSQL connection
├── setup-db.js         # Database initialization script
└── init.sql            # SQL schema (reference only)

frontend/
├── index.html          # Main page
├── script.js           # Auto-detects API URL
└── style.css           # Styling
```

## Database Schema

**events table:**
- `id` (Primary Key)
- `title` - Event name
- `date` - Event date/time
- `category` - Event type
- `venue` - Location
- `description` - Event details

**registrations table:**
- `id` (Primary Key)
- `student_name` - Student full name
- `email` - Student email
- `event_id` - Foreign key to events
- `created_at` - Registration timestamp

## Sample Events

The setup script automatically adds:
1. **Annual Tech Summit** - April 15, 2026 (Technical)
2. **Cultural Fest** - May 1, 2026 (Cultural)
3. **Sports Championship** - May 20, 2026 (Sports)

You can add more events through the API or database directly.

