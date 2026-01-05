-- Languages Table Schema
-- Stores language proficiency with three dimensions
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    language VARCHAR(100) NOT NULL,
    speaking INTEGER DEFAULT 1,
    writing INTEGER DEFAULT 1,
    presenting INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    profile_id INTEGER DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_languages_display_order ON languages(display_order);