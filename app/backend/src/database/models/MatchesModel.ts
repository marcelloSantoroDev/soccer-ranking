import { DataTypes, Model } from 'sequelize';
import db from '.';
import Team from './TeamsModel';

class Match extends Model {
  declare id: number;

  declare homeTeamId: string;

  declare homeTeamGoals: string;

  declare awayTeamId: string;

  declare awayTeamGoals: string;

  declare inProgress: boolean;
}

Match.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    homeTeamId: DataTypes.INTEGER,
    homeTeamGoals: DataTypes.INTEGER,
    awayTeamId: DataTypes.INTEGER,
    awayTeamGoals: DataTypes.INTEGER,
    inProgress: DataTypes.BOOLEAN,
  },
  {
    underscored: true,
    timestamps: false,
    tableName: 'matches',
    sequelize: db,
  },
);

Match.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Match.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'awayTeam' });

export default Match;
