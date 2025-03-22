CREATE TABLE consultant_profiles (
    email VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    skills TEXT,
    hobbies TEXT,
    work_experience TEXT,
    education TEXT,
    certifications TEXT,
    languages TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email)
); 