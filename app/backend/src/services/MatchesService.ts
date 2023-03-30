import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import { IUpdateMatchBody, ICreateMatchBody } from '../interfaces';

export default class MatchesService {
  public getAll = async () => {
    const teams = await MatchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },

      ],
    });
    return { message: teams };
  };

  public getInProgress = async (inProgress: string) => {
    const getProgress = inProgress === 'true';
    const teams = await MatchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },

      ],
      where: { inProgress: getProgress },
    });
    return { message: teams };
  };

  public finish = async (id: number) => {
    await MatchesModel.update({ inProgress: false }, { where: { id } });
    return { message: 'Finished' };
  };

  public update = async ({ id, homeTeamGoals, awayTeamGoals }: IUpdateMatchBody) => {
    await MatchesModel.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    return { message: 'updated' };
  };

  public create = async ({
    homeTeamId,
    awayTeamId,
    homeTeamGoals,
    awayTeamGoals,
  }: ICreateMatchBody) => {
    const newMatch = await MatchesModel.create({
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });
    return { message: newMatch };
  };
}
