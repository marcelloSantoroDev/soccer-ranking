import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import { IUpdateMatchBody, ICreateMatchBody, IMatch } from '../interfaces';

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

  public calculateVictories = (matches: IMatch[]) => {
    const sum = matches.reduce((acc, curr) => {
      if (curr.homeTeamGoals > curr.awayTeamGoals) acc += 1;
      return acc;
    }, 0);
  };

  public getLeaderboard = async () =>
  //   // const teamsIds = teams.map((team) => team.id);
  //   const teams = await TeamsModel.findAll();
  //   const { message } = await this.getInProgress('false');
  //   teams.map((team) => {
  //     const matchesByTeam = message.map((match) => +match.homeTeamId === team.id);
  //     const sums = matchesByTeam.reduce((acc, curr) => {
  //       let ac = acc;
  //       ac += curr.;
  //       return ac;
  //     });
  //   });
    ({ message: '' })
  ;
}
