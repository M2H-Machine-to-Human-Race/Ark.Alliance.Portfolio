-- Business Domains Table Schema
-- Stores business domain knowledge and expertise
CREATE TABLE IF NOT EXISTS business_domains (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    level VARCHAR(50),
    description TEXT,
    years_of_experience INTEGER,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    profile_id INTEGER DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_business_domains_display_order ON business_domains(display_order);