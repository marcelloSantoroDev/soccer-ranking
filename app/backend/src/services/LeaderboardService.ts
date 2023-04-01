import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import { ILeaderBoard } from '../interfaces';

export default class LeaderboardService {
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

  public totalDraws = async (id: number, where: string) => {
    const matches = await this.getMatches(id);
    const drawMatches = where === 'home' ? matches
      .finishedHomeMatches : matches.finishedAwayMatches;
    const draws = drawMatches.reduce((accumulator: number, curr) => {
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

  public totalGoals = async (id: number, type: string, where: string) => {
    const matches = await this.getMatches(id);
    if (type === 'favor' && where === 'home') {
      return matches.finishedHomeMatches
        .reduce((accumulator, curr) => accumulator + Number(curr.homeTeamGoals), 0);
    }

    if (type === 'against' && where === 'home') {
      return matches.finishedHomeMatches
        .reduce((accumulator, curr) => accumulator + Number(curr.awayTeamGoals), 0);
    }

    if (type === 'favor' && where === 'away') {
      return matches.finishedAwayMatches
        .reduce((accumulator, curr) => accumulator + Number(curr.awayTeamGoals), 0);
    }

    return matches.finishedAwayMatches
      .reduce((accumulator, curr) => accumulator + Number(curr.homeTeamGoals), 0);
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
        .totalGoals(id, 'favor', 'home')) - (await this.totalGoals(id, 'against', 'home'));
      return { name: team.teamName,
        totalPoints: (await this.totalPoints(id)).homePoints,
        totalGames: (await this.totalGames(id)).totalHomeMatches,
        totalVictories: (await this.totalVictories(id)).homeVictories,
        totalDraws: await this.totalDraws(id, 'home'),
        totalLosses: (await this.totalLosses(id)).homeLosses,
        goalsFavor: (await this.totalGoals(id, 'favor', 'home')),
        goalsOwn: (await this.totalGoals(id, 'against', 'home')),
        goalsBalance: balance,
        efficiency: Number((((await this.totalPoints(id)).homePoints / ((await this
          .totalGames(id)).totalHomeMatches * 3)) * 100).toFixed(2)) };
    }));
    return { message: this.sortedLeaderboard(calculate) };
  };

  public getAwayLeaderboard = async () => {
    const ids = await this.getTeamsIds();
    const calculate = await Promise.all(ids.map(async (id) => {
      const team = await TeamsModel.findOne({ where: { id } }) || { teamName: 'Unknown' };
      const balance = (await this
        .totalGoals(id, 'favor', 'away')) - (await this.totalGoals(id, 'against', 'away'));
      return { name: team.teamName,
        totalPoints: (await this.totalPoints(id)).awayPoints,
        totalGames: (await this.totalGames(id)).totalAwayMatches,
        totalVictories: (await this.totalVictories(id)).awayVictories,
        totalDraws: await this.totalDraws(id, 'away'),
        totalLosses: (await this.totalLosses(id)).awayLosses,
        goalsFavor: (await this.totalGoals(id, 'favor', 'away')),
        goalsOwn: (await this.totalGoals(id, 'against', 'away')),
        goalsBalance: balance,
        efficiency: Number((((await this.totalPoints(id)).awayPoints / ((await this
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
