-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  category VARCHAR(100),
  venue VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_id ON registrations(event_id);

-- Sample events (optional - remove if not needed)
INSERT INTO events (title, date, category, venue, description) VALUES
('Annual Tech Summit', '2026-04-15 10:00:00', 'Technical', 'Auditorium A', 'A comprehensive tech summit featuring latest innovations'),
('Cultural Fest', '2026-05-01 16:00:00', 'Cultural', 'Open Grounds', 'Celebrate diverse cultures with performances and food'),
('Sports Championship', '2026-05-20 08:00:00', 'Sports', 'Sports Complex', 'Inter-college sports competition');
