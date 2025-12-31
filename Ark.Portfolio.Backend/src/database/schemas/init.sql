-- Database Initialization Script for Ark Portfolio

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    bio TEXT,
    email VARCHAR(200) NOT NULL,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    repo_url VARCHAR(255),
    demo_url VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_technologies (
    project_id INTEGER REFERENCES projects(id),
    technology VARCHAR(50),
    PRIMARY KEY (project_id, technology)
);

CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    profile_id INTEGER DEFAULT 1 -- Assuming single user portfolio usually
);

CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    position VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    profile_id INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50),
    category VARCHAR(100),
    profile_id INTEGER DEFAULT 1
);
