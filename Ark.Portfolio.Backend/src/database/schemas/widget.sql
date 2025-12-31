CREATE TABLE IF NOT EXISTS widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  "order" INTEGER DEFAULT 0,
  config TEXT, -- Stored as JSON string in SQLite/Simple JSON
  context VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
