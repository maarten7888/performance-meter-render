import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: 'mysql.tothepointcompany.nl',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'tothepoi_performance_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}); 