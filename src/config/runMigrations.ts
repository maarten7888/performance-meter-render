import { pool } from './database';
import { readFileSync } from 'fs';
import { join } from 'path';

const runMigrations = async () => {
  try {
    const sql = readFileSync(join(__dirname, 'migrations.sql'), 'utf8');
    const statements = sql.split(';').filter(statement => statement.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

runMigrations(); 