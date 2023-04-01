import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import { IUpdateMatchBody, ICreateMatchBody } from '../interfaces';

interface ILeaderBoard {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: number
}

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
        if (curr.homeTeamGoals === curr.awayTeamGoals) acc += 1;
        return acc;
      }, 0);
    const awayPoints = matches.finishedAwayMatches
      .reduce((accumulator, curr) => {
        let acc = accumulator;
        if (curr.awayTeamGoals > curr.homeTeamGoals) acc += 3;
        if (curr.awayTeamGoals < curr.homeTeamGoals) acc += 0;
        if (curr.awayTeamGoals === curr.homeTeamGoals) acc += 1;
        return acc;
      }, 0);
    return { homePoints, awayPoints };
  };

  public totalGames = async (id: number) => {
    const matches = this.getMatches(id);
    const totalHomeMatches = (await matches).finishedHomeMatches.length;
    const totalAwayMatches = (await matches).finishedAwayMatches.length;
    return { totalHomeMatches, totalAwayMatches };
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
    return { homeVictories, awayVictories };
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
    return { homeLosses, awayLosses };
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
    return { homeGoals, awayGoals };
  };

  public getTeamsIds = async () => {
    const teams = await TeamsModel.findAll();
    const ids = teams.map((team) => team.id);
    return ids;
  };

  public getHomeLeaderboard = async () => {
    const ids = await this.getTeamsIds();
    const calculate = await Promise.all(ids.map(async (id) => {
      const team = await TeamsModel.findOne({ where: { id } }) || { teamName: 'Unknown' };
      const balance = (await this
        .totalGoals(id, 'favor')).homeGoals - (await this.totalGoals(id, 'against')).homeGoals;
      return { name: team.teamName,
        totalPoints: (await this.totalPoints(id)).homePoints,
        totalGames: (await this.totalGames(id)).totalHomeMatches,
        totalVictories: (await this.totalVictories(id)).homeVictories,
        totalDraws: await this.totalDraws(id),
        totalLosses: (await this.totalLosses(id)).homeLosses,
        goalsFavor: (await this.totalGoals(id, 'favor')).homeGoals,
        goalsOwn: (await this.totalGoals(id, 'against')).homeGoals,
        goalsBalance: balance,
        efficiency: Number(((await (await this.totalPoints(id)).homePoints / ((await this
          .totalGames(id)).totalHomeMatches * 3)) * 100).toFixed(2)) };
    }));
    return { message: this.sortedLeaderboard(calculate) };
  };

  public getAwayLeaderboard = async () => {
    const ids = await this.getTeamsIds();
    const calculate = await Promise.all(ids.map(async (id) => {
      const team = await TeamsModel.findOne({ where: { id } }) || { teamName: 'Unknown' };
      const balance = (await this
        .totalGoals(id, 'favor')).awayGoals - (await this.totalGoals(id, 'against')).awayGoals;
      return { name: team.teamName,
        totalPoints: (await this.totalPoints(id)).awayPoints,
        totalGames: (await this.totalGames(id)).totalAwayMatches,
        totalVictories: (await this.totalVictories(id)).awayVictories,
        totalDraws: await this.totalDraws(id),
        totalLosses: (await this.totalLosses(id)).awayLosses,
        goalsFavor: (await this.totalGoals(id, 'favor')).awayGoals,
        goalsOwn: (await this.totalGoals(id, 'against')).awayGoals,
        goalsBalance: balance,
        efficiency: Number(((await (await this.totalPoints(id)).awayPoints / ((await this
          .totalGames(id)).totalAwayMatches * 3)) * 100).toFixed(2)) };
    }));
    return { message: this.sortedLeaderboard(calculate) };
  };

  public sortedLeaderboard = (leaderboard: ILeaderBoard[]) => {
    const sort = leaderboard.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }

      if (b.totalVictories !== a.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }

      if (b.goalsBalance !== a.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }

      return b.goalsFavor - a.goalsFavor;
    });

    return sort;
  };
}
