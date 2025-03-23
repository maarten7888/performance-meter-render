-- Create consultant_profiles table
CREATE TABLE IF NOT EXISTS consultant_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    fullName VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    phoneNumber VARCHAR(50),
    location VARCHAR(255),
    bio TEXT,
    profileImage VARCHAR(255),
    skills JSON,
    languages JSON,
    strengths JSON,
    hobbies JSON,
    experience JSON,
    education JSON,
    certifications JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
); 