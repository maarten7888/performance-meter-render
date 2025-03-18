import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'mysql://tothepoi_pm:63%401Cy9dz@mysql.tothepointcompany.nl:3306/tothepoi_performance_db';

// Parse database URL
const dbConfig = new URL(dbUrl);

// Sequelize configuratie
export const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
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