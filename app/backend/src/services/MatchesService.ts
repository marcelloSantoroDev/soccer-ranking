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

  public getMatches = async (id: number) => {
    const homeMatches = await MatchesModel.findAll({ where: { homeTeamId: id } });
    const finishedHomeMatches = homeMatches.filter((match) => match.inProgress === false);
    const awayMatches = await MatchesModel.findAll({ where: { awayTeamId: id } });
    const finishedAwayMatches = awayMatches.filter((match) => match.inProgress === false);
    return { finishedHomeMatches, finishedAwayMatches };
  };

  public totalPoints = async (id: number) => {
    const matches = await this.getMatches(id);
    const homePoints = matches.finishedHomeMatches
      .reduce((accumulator, curr) => {
        let acc = accumulator;
        if (curr.homeTeamGoals > curr.awayTeamGoals) acc += 3;
        if (curr.homeTeamGoals < curr.awayTeamGoals) acc += 0;
        acc += 1;
        return acc;
      }, 0);
    const awayPoints = matches.finishedAwayMatches
      .reduce((accumulator, curr) => {
        let acc = accumulator;
        if (curr.awayTeamGoals > curr.homeTeamGoals) acc += 3;
        if (curr.awayTeamGoals < curr.homeTeamGoals) acc += 0;
        acc += 1;
        return acc;
      }, 0);
    return homePoints + awayPoints;
  };

  public totalGames = async (id: number) => {
    const matches = this.getMatches(id);
    const totalHomeMatches = (await matches).finishedHomeMatches.length;
    const totalAwayMatches = (await matches).finishedAwayMatches.length;
    return totalHomeMatches + totalAwayMatches;
  };

  public totalVictories = async (id: number) => {
    const matches = await this.getMatches(id);
    const homeVictories = matches.finishedHomeMatches
      .reduce((accumulator, curr) => {
        let acc = accumulator;
        if (curr.homeTeamGoals > curr.awayTeamGoals) acc += 1;
        return acc;
      }, 0);
    const awayVictories = matches.finishedAwayMatches
      .reduce((accumulator, curr) => {
        let acc = accumulator;
        if (curr.awayTeamGoals > curr.homeTeamGoals) acc += 1;
        return acc;
      }, 0);
    return homeVictories + awayVictories;
  };

  public totalDraws = async (id: number) => {
    const matches = await this.getMatches(id);
    const draws = matches.finishedHomeMatches.reduce((accumulator: number, curr) => {
      let acc = accumulator;
      if (curr.homeTeamGoals === curr.awayTeamGoals) {
        acc += 1;
      }
      return acc;
    }, 0);
    return draws;
  };

  public totalLosses = async (id: number) => {
    const matches = await this.getMatches(id);
    const homeLosses = matches.finishedHomeMatches
      .reduce((accumulator, curr) => {
        let acc = accumulator;
        if (curr.homeTeamGoals < curr.awayTeamGoals) acc += 1;
        return acc;
      }, 0);
    const awayLosses = matches.finishedAwayMatches
      .reduce((accumulator, curr) => {
        let acc = accumulator;
        if (curr.awayTeamGoals < curr.homeTeamGoals) acc += 1;
        return acc;
      }, 0);
    return homeLosses + awayLosses;
  };

  public totalGoals = async (id: number, type: string) => {
    const matches = await this.getMatches(id);
    const reducer = (accumulator: number, curr: MatchesModel) => {
      let acc = accumulator;
      if (type === 'favor') {
        acc += Number(curr.homeTeamGoals);
      } else {
        acc += Number(curr.awayTeamGoals);
      }
      return acc;
    };
    const homeGoals = matches.finishedHomeMatches.reduce(reducer, 0);
    const awayGoals = matches.finishedAwayMatches.reduce(reducer, 0);
    return homeGoals + awayGoals;
  };

  public getLeaderboard = async () => {
    const teams = await TeamsModel.findAll();
    const ids = teams.map((team) => team.id);
    const calculate = await Promise.all(ids.map(async (id) => {
      const team = await TeamsModel.findOne({ where: { id } }) || { teamName: 'Unknown' };
      return {
        name: team.teamName,
        totalPoints: await this.totalPoints(id),
        totalGames: await this.totalGames(id),
        totalVictories: await this.totalVictories(id),
        totalDraws: await this.totalDraws(id),
        totalLosses: await this.totalLosses(id),
        goalsFavor: await this.totalGoals(id, 'favor'),
        goalsOwn: await this.totalGoals(id, 'against'),
      };
    }));
    return { message: calculate };
  };
}

// preciso refatorar esse service. muitos acessos ao db
