#!/usr/bin/env node

/**
 * Database Setup Script
 * Creates database and tables if they don't exist
 */

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

    // Add sample data if table is empty
    const countEvents = await pool.query("SELECT COUNT(*) FROM events");
    if (countEvents.rows[0].count === "0") {
      await pool.query(`
        INSERT INTO events (title, date, category, venue, description) VALUES
        ('Annual Tech Summit', '2026-04-15 10:00:00', 'Technical', 'Auditorium A', 'A comprehensive tech summit featuring latest innovations'),
        ('Cultural Fest', '2026-05-01 16:00:00', 'Cultural', 'Open Grounds', 'Celebrate diverse cultures with performances and food'),
        ('Sports Championship', '2026-05-20 08:00:00', 'Sports', 'Sports Complex', 'Inter-college sports competition');
      `);
      console.log("✓ Sample data inserted");
    }

    await pool.end();
    console.log("\n✓ Database setup completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("✗ Error setting up database:", error.message);
    process.exit(1);
  }
}

setupDatabase();
