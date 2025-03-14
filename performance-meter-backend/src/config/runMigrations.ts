import { sequelize } from './database';
import fs from 'fs';
import path from 'path';

const runMigrations = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'migrations.sql'), 'utf8');
    const statements = sql.split(';').filter(statement => statement.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await sequelize.query(statement);
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