CREATE TABLE IF NOT EXISTS project_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  type TEXT NOT NULL,
  nav_order INTEGER DEFAULT 0,
  content TEXT,
  project_id UUID,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
