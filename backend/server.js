const express = require("express");
const cors = require("cors");
const path = require("path");

// Load environment variables from .env
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Environment detection
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

console.log("═══════════════════════════════════");
console.log("🚀 Environment:", NODE_ENV);
console.log("🔌 Port:", PORT);
console.log("═══════════════════════════════════");

// Log environment check
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL not set in .env file");
  console.log("Current directory:", __dirname);
  console.log("Environment variables loaded:", Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("PORT")));
  process.exit(1);
}

const pool = require("./db");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5000",
      "http://localhost",
      "http://127.0.0.1",
      // GitHub Pages domains
      "https://rithesh-7464.github.io",
      "https://rithesh-7464.github.io/project"
    ];
    
    // In production, allow the request if origin is in allowedOrigins
    if (NODE_ENV === "production") {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("⚠️  CORS blocked origin:", origin);
        callback(new Error("CORS policy violation"));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

console.log("✓ CORS enabled for production domains");


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
    
    // Check if events exist and insert if empty
    const eventCount = await pool.query("SELECT COUNT(*) FROM events");
    if (parseInt(eventCount.rows[0].count) === 0) {
      console.log("Inserting sample events...");
      
      await pool.query(`
        INSERT INTO events (title, date, category, venue, description) VALUES
        ('Annual Tech Summit', '2026-04-15 10:00:00', 'Technical', 'Auditorium A', 'A comprehensive tech summit featuring latest innovations'),
        ('Cultural Fest', '2026-05-01 16:00:00', 'Cultural', 'Open Grounds', 'Celebrate diverse cultures with performances and food'),
        ('Sports Championship', '2026-05-20 08:00:00', 'Sports', 'Sports Complex', 'Inter-college sports competition'),
        ('Coding Challenge', '2026-04-22 09:00:00', 'Technical', 'Computer Lab', 'Compete in a 3-hour coding competition with exciting prizes'),
        ('Art & Music Festival', '2026-05-10 18:00:00', 'Cultural', 'Amphitheater', 'Showcase your artistic talents through performances and exhibitions');
      `);
      
      console.log("✓ Sample events inserted (5 events)");
    } else {
      console.log(`✓ Events already exist (${eventCount.rows[0].count} events)`);
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


// SETUP ENDPOINT - Populate database with sample events
app.get("/api/setup", async (req, res) => {
  try {
    console.log("Running setup endpoint...");
    
    // Check current event count
    const countEvents = await pool.query("SELECT COUNT(*) FROM events");
    const currentCount = parseInt(countEvents.rows[0].count);
    console.log(`Current events in database: ${currentCount}`);
    
    // Insert missing events
    const existingTitles = await pool.query("SELECT title FROM events");
    const titles = existingTitles.rows.map(r => r.title);
    
    const eventsToAdd = [
      { title: 'Annual Tech Summit', date: '2026-04-15 10:00:00', category: 'Technical', venue: 'Auditorium A', description: 'A comprehensive tech summit featuring latest innovations' },
      { title: 'Cultural Fest', date: '2026-05-01 16:00:00', category: 'Cultural', venue: 'Open Grounds', description: 'Celebrate diverse cultures with performances and food' },
      { title: 'Sports Championship', date: '2026-05-20 08:00:00', category: 'Sports', venue: 'Sports Complex', description: 'Inter-college sports competition' },
      { title: 'Coding Challenge', date: '2026-04-22 09:00:00', category: 'Technical', venue: 'Computer Lab', description: 'Compete in a 3-hour coding competition with exciting prizes' },
      { title: 'Art & Music Festival', date: '2026-05-10 18:00:00', category: 'Cultural', venue: 'Amphitheater', description: 'Showcase your artistic talents through performances and exhibitions' }
    ];
    
    for (const event of eventsToAdd) {
      if (!titles.includes(event.title)) {
        await pool.query(
          `INSERT INTO events (title, date, category, venue, description) VALUES ($1, $2, $3, $4, $5)`,
          [event.title, event.date, event.category, event.venue, event.description]
        );
        console.log(`✓ Added: ${event.title}`);
      }
    }
    
    const finalCount = await pool.query("SELECT COUNT(*) FROM events");
    res.json({
      message: "Setup complete!",
      totalEvents: finalCount.rows[0].count
    });
  } catch (error) {
    console.error("Setup error:", error.message);
    res.status(500).json({ error: error.message });
  }
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