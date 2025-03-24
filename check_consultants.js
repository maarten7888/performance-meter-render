const mysql = require('mysql2/promise');

async function checkConsultantsTable() {
  const connection = await mysql.createConnection({
    host: 'mysql.tothepointcompany.nl',
    user: 'tothepoi_pm',
    password: '63@1Cy9dz',
    database: 'tothepoi_performance_db'
  });

  try {
    // Check if table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "consultants"');
    if (tables.length === 0) {
      console.log('Consultants table does not exist');
      return;
    }

    // Get table structure
    const [columns] = await connection.execute('DESCRIBE consultants');
    console.log('Consultants table structure:', columns);

    // Get sample data
    const [data] = await connection.execute('SELECT * FROM consultants LIMIT 1');
    console.log('Sample data:', data);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkConsultantsTable(); 