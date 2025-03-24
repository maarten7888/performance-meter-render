-- Create consultants table
CREATE TABLE IF NOT EXISTS consultants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    profile_image VARCHAR(255),
    role VARCHAR(10) NOT NULL,
    start_date DATE NOT NULL,
    bio TEXT,
    skill_moves INT,
    weak_foot INT,
    stat_punctuality INT,
    stat_teamwork INT,
    stat_focus INT,
    stat_skills INT,
    stat_hours INT,
    stat_communication INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX idx_consultants_user_id ON consultants(user_id);
CREATE INDEX idx_consultants_role ON consultants(role); 