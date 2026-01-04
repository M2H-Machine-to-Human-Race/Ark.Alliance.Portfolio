-- Skills Table Schema
-- Stores individual skills linked to categories
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50),
    percentage INTEGER DEFAULT 0,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES skill_categories(id) ON DELETE
    SET NULL,
        profile_id INTEGER DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_skills_category_id ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order);