-- AI Settings Table Schema
-- Stores AI provider configuration with encrypted API key
CREATE TABLE IF NOT EXISTS ai_settings (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) DEFAULT 'openai',
    api_url VARCHAR(500),
    api_key_encrypted TEXT,
    model VARCHAR(100) DEFAULT 'gpt-4',
    temperature DECIMAL(3, 2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);