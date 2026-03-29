

const { Pool } = require("pg");
require("dotenv").config();

async function setupDatabase() {
  // First connection to postgres default db
  const adminPool = new Pool({
    connectionString: process.env.DATABASE_URL.replace(/\/[^\/]*$/, "/postgres"),
    ssl: process.env.DATABASE_URL?.includes("render.com")
      ? { rejectUnauthorized: false }
      : false
  });

  try {
    console.log("Attempting to create database and tables...");

    // Extract database name from DATABASE_URL
    const dbName = process.env.DATABASE_URL.split("/").pop();

    // Create database if it doesn't exist
    try {
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✓ Database '${dbName}' created`);
    } catch (err) {
      if (err.code === "42P04") {
        console.log(`✓ Database '${dbName}' already exists`);
      } else {
        throw err;
      }
    }

    await adminPool.end();

    // Connect to the actual database and create tables
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes("render.com")
        ? { rejectUnauthorized: false }
        : false
    });

    // Create events table
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
    console.log("✓ Events table created");

    // Create registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Registrations table created");

    // Create index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_event_id ON registrations(event_id);
    `);
    console.log("✓ Index created");

    // Add sample data - ensure we have all 5 events
    const countEvents = await pool.query("SELECT COUNT(*) FROM events");
    console.log(`Current events in database: ${countEvents.rows[0].count}`);
    
    // Always ensure we have at least 5 events
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
        console.log(`✓ Added event: ${event.title}`);
      }
    }
    
    const finalCount = await pool.query("SELECT COUNT(*) FROM events");
    console.log(`✓ Sample data complete (${finalCount.rows[0].count} total events)`);

    await pool.end();
    console.log("\n✓ Database setup completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("✗ Error setting up database:", error.message);
    process.exit(1);
  }
}

setupDatabase();
