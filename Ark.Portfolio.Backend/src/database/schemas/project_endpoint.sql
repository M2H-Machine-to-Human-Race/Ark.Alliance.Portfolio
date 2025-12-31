CREATE TABLE IF NOT EXISTS project_endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  method VARCHAR(10) NOT NULL,
  path VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  controller_id UUID,
  FOREIGN KEY (controller_id) REFERENCES project_controllers(id) ON DELETE CASCADE
);
