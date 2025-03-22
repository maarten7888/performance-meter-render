import mysql from 'mysql2/promise';

const dbUrl = 'mysql://tothepoi_pm:63%401Cy9dz@mysql.tothepointcompany.nl:3306/tothepoi_performance_db';

async function addYearlyTarget() {
  try {
    const connection = await mysql.createConnection(dbUrl);
    console.log('Database connected successfully');

    // Voeg de yearlyTarget kolom toe
    await connection.query(`
      ALTER TABLE users
      ADD COLUMN yearlyTarget DECIMAL(10, 2) DEFAULT 150000
    `);
    console.log('YearlyTarget column added successfully');

    // Update bestaande gebruikers
    await connection.query(`
      UPDATE users
      SET yearlyTarget = 150000
      WHERE yearlyTarget IS NULL
    `);
    console.log('Existing users updated successfully');

    await connection.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addYearlyTarget(); 