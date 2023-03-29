import { DataTypes, Model } from 'sequelize';
import db from '.';

class User extends Model {
  declare id: number;

  declare username: string;

  declare role: string;

  declare email: string;

  declare password: string;
}

User.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    username: DataTypes.STRING,
    role: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    underscored: true,
    timestamps: false,
    tableName: 'users',
    sequelize: db,
  },
);

export default User;
