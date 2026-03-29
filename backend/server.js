const express = require("express");
const cors = require("cors");
const path = require("path");

// Load environment variables from .env
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Log environment check
if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL not set in .env file");
  console.log("Current directory:", __dirname);
  console.log("Environment variables loaded:", Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("PORT")));
}

const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// INITIALIZE DATABASE ON STARTUP
async function initializeDatabase() {
  try {
    // Check if tables exist
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'events'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log("Initializing database tables...");
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          date TIMESTAMP NOT NULL,
          category VARCHAR(100),
          venue VARCHAR(255),
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS registrations (
          id SERIAL PRIMARY KEY,
          student_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_event_id ON registrations(event_id);
      `);
      
      console.log("Database tables created successfully!");
    } else {
      console.log("Database tables already exist!");
    }
  } catch (error) {
    console.error("Error initializing database:", error.message);
  }
}

// Initialize database before starting server
initializeDatabase();


// HOME ROUTE

app.get("/", (req, res) => {
  res.send("College Event Management Backend with PostgreSQL is running 🚀");
});


// GET ALL EVENTS

app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Server error while fetching events" });
  }
});


// ADD NEW EVENT

app.post("/api/events", async (req, res) => {
  try {
    const { title, date, category, venue, description } = req.body;

    if (!title || !date || !category || !venue || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO events (title, date, category, venue, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, date, category, venue, description]
    );

    res.status(201).json({
      message: "Event added successfully",
      event: result.rows[0]
    });
  } catch (error) {
    console.error("Error adding event:", error.message);
    res.status(500).json({ message: "Server error while adding event" });
  }
});


// REGISTER FOR EVENT

app.post("/api/register", async (req, res) => {
  try {
    const { studentName, email, eventId } = req.body;

    if (!studentName || !email || !eventId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if event exists
    const eventCheck = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const selectedEvent = eventCheck.rows[0];

    const result = await pool.query(
      `INSERT INTO registrations (student_name, email, event_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [studentName, email, eventId]
    );

    res.status(201).json({
      message: "Registration successful",
      registration: {
        ...result.rows[0],
        studentName,
        eventTitle: selectedEvent.title
      }
    });
  } catch (error) {
    console.error("Error registering student:", error.message);
    res.status(500).json({ message: "Server error while registering" });
  }
});


// GET ALL REGISTRATIONS

app.get("/api/registrations", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        registrations.id,
        registrations.student_name AS "studentName",
        registrations.email,
        registrations.created_at,
        events.title AS "eventTitle"
      FROM registrations
      JOIN events ON registrations.event_id = events.id
      ORDER BY registrations.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching registrations:", error.message);
    res.status(500).json({ message: "Server error while fetching registrations" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});