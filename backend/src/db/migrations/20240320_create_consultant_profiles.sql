-- Create consultant_profiles table
CREATE TABLE IF NOT EXISTS consultant_profiles (
    email VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bio TEXT,
    strengths TEXT,
    hobbies TEXT,
    experience TEXT,
    education TEXT,
    certifications TEXT,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
); 