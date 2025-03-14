import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Project } from './Project';

export class TimeEntry extends Model {
  public id!: number;
  public userId!: number;
  public projectId!: number;
  public date!: Date;
  public hours!: number;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TimeEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'time_entries',
    timestamps: true,
  }
);

TimeEntry.belongsTo(User, { foreignKey: 'userId' });
TimeEntry.belongsTo(Project, { foreignKey: 'projectId' }); 