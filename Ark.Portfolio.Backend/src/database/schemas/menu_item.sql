-- Menu Items Table Schema
-- Stores navigation menu items with hierarchical support
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    route VARCHAR(255) NOT NULL,
    position VARCHAR(20) DEFAULT 'header',
    "order" INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    open_in_new_tab BOOLEAN DEFAULT FALSE,
    parent_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_menu_items_position ON menu_items(position);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON menu_items(parent_id);