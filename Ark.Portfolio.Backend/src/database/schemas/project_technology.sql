CREATE TABLE IF NOT EXISTS project_technologies (
  project_id UUID NOT NULL,
  technology VARCHAR(50) NOT NULL,
  PRIMARY KEY (project_id, technology),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
