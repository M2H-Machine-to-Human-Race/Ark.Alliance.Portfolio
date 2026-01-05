-- Project Features Table Schema
-- Stores feature highlights for projects
CREATE TABLE IF NOT EXISTS project_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(255),
  image_url TEXT,
  project_id UUID,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_project_features_project_id ON project_features(project_id);