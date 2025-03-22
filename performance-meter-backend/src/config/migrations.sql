-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  yearlyTarget DECIMAL(10, 2),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  hourlyRate DECIMAL(10, 2) NOT NULL,
  userId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Time entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  projectId INT NOT NULL,
  date DATE NOT NULL,
  hours FLOAT NOT NULL,
  description TEXT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);

-- Consultant profiles table
CREATE TABLE IF NOT EXISTS consultant_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(50),
  skills JSON,
  languages JSON,
  workExperience JSON,
  education JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
); 