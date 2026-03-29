const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


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