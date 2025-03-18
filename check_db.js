const mysql = require('mysql2/promise');

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: 'mysql.tothepointcompany.nl',
    user: 'tothepoi_pm',
    password: '63@1Cy9dz',
    database: 'tothepoi_performance_db'
  });

  try {
    const [rows] = await connection.execute(
      "SELECT id, email, role FROM users"
    );
    console.log('Database resultaten:', rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkDatabase(); 