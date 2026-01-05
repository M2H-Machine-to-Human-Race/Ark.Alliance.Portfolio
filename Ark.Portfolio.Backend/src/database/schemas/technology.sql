-- Technology Table Schema
-- Master data for technologies/frameworks used in projects
CREATE TABLE IF NOT EXISTS technologies (
    key VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    label VARCHAR(150),
    category VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(20),
    website VARCHAR(255),
    versions TEXT,
    -- Simple array stored as comma-separated
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_technologies_category ON technologies(category);
CREATE INDEX IF NOT EXISTS idx_technologies_is_active ON technologies(is_active);