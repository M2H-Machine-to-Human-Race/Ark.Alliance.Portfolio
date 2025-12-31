CREATE TABLE IF NOT EXISTS project_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(255),
  project_id UUID,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
