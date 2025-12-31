CREATE TABLE IF NOT EXISTS project_controllers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  base_path VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  project_id UUID,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
