CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,
  image_url VARCHAR(255),
  repo_url VARCHAR(255),
  demo_url VARCHAR(255),
  start_date DATE,
  end_date DATE
);
