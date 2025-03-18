import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL;

// Parse database URL
const dbConfig = new URL(dbUrl);

// Log database connection details (zonder wachtwoord)
console.log('[Database] Connecting to:', {
  host: dbConfig.hostname,
  port: dbConfig.port,
  user: dbConfig.username,
  database: dbConfig.pathname.substr(1)
});

// MySQL pool configuratie
export const pool = mysql.createPool({
  host: dbConfig.hostname,
  port: parseInt(dbConfig.port) || 3306,
  user: dbConfig.username,
  password: decodeURIComponent(dbConfig.password),
  database: dbConfig.pathname.substr(1),
  ssl: {
    rejectUnauthorized: false
  }
}); 