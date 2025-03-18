import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('users', 'yearlyTarget', {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('users', 'yearlyTarget');
} 