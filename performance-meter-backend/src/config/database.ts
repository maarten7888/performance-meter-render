import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'mysql://tothepoi_pm:63%401Cy9dz@mysql.tothepointcompany.nl:3306/tothepoi_performance_db';

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