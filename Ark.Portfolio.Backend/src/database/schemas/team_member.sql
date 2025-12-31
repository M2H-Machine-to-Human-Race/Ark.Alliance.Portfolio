CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  bio TEXT,
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255)
);
