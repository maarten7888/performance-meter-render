import { Sequelize } from 'sequelize';

const dbUrl = 'mysql://tothepoi_pm:63%401Cy9dz@mysql.tothepointcompany.nl:3306/tothepoi_performance_db';

const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

async function checkAdminRole() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');

    const [results] = await sequelize.query(
      "SELECT id, email, role FROM users WHERE email = 'maarten.jansen@tothepointcompany.nl'"
    );

    console.log('Query results:', results);
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminRole(); 