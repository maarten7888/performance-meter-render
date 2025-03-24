import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'mysql.tothepointcompany.nl',
    user: 'tothepoi_pm',
    password: '63@1Cy9dz',
    database: 'tothepoi_performance_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export { pool }; 