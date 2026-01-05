-- Carousel Items Table Schema
-- Stores homepage carousel slides
CREATE TABLE IF NOT EXISTS carousel_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    link_text VARCHAR(100),
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    project_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_carousel_items_order ON carousel_items("order");
CREATE INDEX IF NOT EXISTS idx_carousel_items_is_active ON carousel_items(is_active);