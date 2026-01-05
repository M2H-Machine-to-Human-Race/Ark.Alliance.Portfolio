-- Style Config Table Schema
-- Stores theme configuration settings
CREATE TABLE IF NOT EXISTS style_config (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    color_scheme VARCHAR(20) DEFAULT 'light',
    primary_color VARCHAR(20) DEFAULT '#ffffff',
    secondary_color VARCHAR(20) DEFAULT '#000000',
    accent_color VARCHAR(20) DEFAULT '#3b82f6',
    background_color VARCHAR(20) DEFAULT '#ffffff',
    text_color VARCHAR(20) DEFAULT '#1f2937',
    color_palette TEXT,
    -- JSON array
    heading_font TEXT,
    -- JSON object
    body_font TEXT,
    -- JSON object
    base_font_size INTEGER DEFAULT 16,
    border_radius INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_style_config_is_active ON style_config(is_active);