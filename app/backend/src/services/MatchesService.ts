import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import { IUpdateMatchBody, ICreateMatchBody, IMatchesService } from '../interfaces';

export default class MatchesService implements IMatchesService {
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
    return { message: 'Match updated' };
  };

  public create = async ({
    homeTeamId,
    awayTeamId,
    homeTeamGoals,
    awayTeamGoals }: ICreateMatchBody) => {
    const homeTeamCheck = await TeamsModel.findOne({ where: { id: Number(homeTeamId) } });
    const awayTeamCheck = await TeamsModel.findOne({ where: { id: Number(awayTeamId) } });
    const teamsArray = [homeTeamCheck, awayTeamCheck];
    if (teamsArray.some((team) => team === null)) {
      return { type: 'NOT_FOUND', message: 'There is no team with such id!' };
    }
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

// add type: null
