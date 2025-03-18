import { sequelize } from '../config/database';
import { up } from './20250318_add_yearly_target';

async function runMigrations() {
  try {
    await up(sequelize.getQueryInterface());
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations(); 