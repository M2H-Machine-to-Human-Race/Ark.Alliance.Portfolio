-- Hobbies Table Schema
-- Stores personal hobbies and interests
CREATE TABLE IF NOT EXISTS hobbies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    profile_id INTEGER DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_hobbies_display_order ON hobbies(display_order);