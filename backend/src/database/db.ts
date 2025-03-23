import mysql, { PoolOptions } from 'mysql2/promise';

const poolConfig: PoolOptions = {
    host: process.env.DB_HOST || 'mysql.tothepointcompany.nl',
    user: process.env.DB_USER || 'tothepoi_pm',
    password: process.env.DB_PASSWORD || '63@1Cy9dz',
    database: process.env.DB_NAME || 'tothepoi_performance_db',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000
};

const pool = mysql.createPool(poolConfig);

// Test de database connectie
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

export { pool }; 