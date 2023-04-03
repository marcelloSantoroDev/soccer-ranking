import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import { ILeaderBoard, ILeaderboardService, IGetMatches } from '../interfaces';

export default class LeaderboardService implements ILeaderboardService {
  public getMatches = async (id: number) => {
    const homeMatches = await MatchesModel.findAll({ where: { homeTeamId: id } });
    const finishedHomeMatches = homeMatches.filter((match) => match.inProgress === false);
    const awayMatches = await MatchesModel.findAll({ where: { awayTeamId: id } });
    const finishedAwayMatches = awayMatches.filter((match) => match.inProgress === false);
    return { finishedHomeMatches, finishedAwayMatches };
  };

  public totalPoints = (id: number, matches: IGetMatches) => {
    const homePoints = matches.finishedHomeMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      if (curr.homeTeamGoals > curr.awayTeamGoals) acc += 3;
      if (curr.homeTeamGoals < curr.awayTeamGoals) acc += 0;
      if (curr.homeTeamGoals === curr.awayTeamGoals) acc += 1;
      return acc;
    }, 0);
    const awayPoints = matches.finishedAwayMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      if (curr.awayTeamGoals > curr.homeTeamGoals) acc += 3;
      if (curr.awayTeamGoals < curr.homeTeamGoals) acc += 0;
      if (curr.awayTeamGoals === curr.homeTeamGoals) acc += 1;
      return acc;
    }, 0);
    return { homePoints, awayPoints, allPoints: homePoints + awayPoints };
  };

  public totalGames = (id: number, matches: IGetMatches) => {
    const totalHomeMatches = matches.finishedHomeMatches.length;
    const totalAwayMatches = matches.finishedAwayMatches.length;
    return {
      totalHomeMatches, totalAwayMatches, totalMatches: totalHomeMatches + totalAwayMatches };
  };

  public totalVictories = (id: number, matches: IGetMatches) => {
    const homeVictories = matches.finishedHomeMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      if (curr.homeTeamGoals > curr.awayTeamGoals) acc += 1;
      return acc;
    }, 0);
    const awayVictories = matches.finishedAwayMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      if (curr.awayTeamGoals > curr.homeTeamGoals) acc += 1;
      return acc;
    }, 0);
    return { homeVictories, awayVictories, totalVictories: homeVictories + awayVictories };
  };

  public totalDraws = (id: number, where: string, matches: IGetMatches) => {
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

  public totalGeneralDraws = (id: number, matches: IGetMatches) => {
    const homeDraws = matches.finishedHomeMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      if (curr.homeTeamGoals === curr.awayTeamGoals) acc += 1;
      return acc;
    }, 0);
    const awayDraws = matches.finishedAwayMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      if (curr.awayTeamGoals === curr.homeTeamGoals) acc += 1;
      return acc;
    }, 0);
    return homeDraws + awayDraws;
  };

  public totalLosses = (id: number, matches: IGetMatches) => {
    const homeLosses = matches.finishedHomeMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      if (curr.homeTeamGoals < curr.awayTeamGoals) acc += 1;
      return acc;
    }, 0);
    const awayLosses = matches.finishedAwayMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      if (curr.awayTeamGoals < curr.homeTeamGoals) acc += 1;
      return acc;
    }, 0);
    return { homeLosses, awayLosses, totalLosses: homeLosses + awayLosses };
  };

  public totalGoals = (id: number, type: string, where: string, matches: IGetMatches) => {
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

  public totalGoalsFavor = (id: number, matches: IGetMatches) => {
    const homeGoals = matches.finishedHomeMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      acc += Number(curr.homeTeamGoals);
      return acc;
    }, 0);
    const awayGoals = matches.finishedAwayMatches.reduce((accumulator, curr) => {
      let acc = accumulator;
      acc += Number(curr.awayTeamGoals);
      return acc;
    }, 0);

    return homeGoals + awayGoals;
  };

  public totalGoalsAgainst = (id: number, matches: IGetMatches) => {
    const homeGoalsAgainst = matches.finishedHomeMatches.reduce((accumulator, curr) => {
      let acc2 = accumulator;
      acc2 += Number(curr.awayTeamGoals);
      return acc2;
    }, 0);
    const awayGoalsAgainst = matches.finishedAwayMatches.reduce((accumulator, curr) => {
      let acc2 = accumulator;
      acc2 += Number(curr.homeTeamGoals);
      return acc2;
    }, 0);

    return homeGoalsAgainst + awayGoalsAgainst;
  };

  public getTeamsIds = async () => {
    const teams = await TeamsModel.findAll();
    return teams.map((team) => team.id);
  };

  public getHomeLeaderboard = async () => {
    const ids = await this.getTeamsIds();
    const calculate = await Promise.all(ids.map(async (id) => {
      const matches = await this.getMatches(id);
      const team = await TeamsModel.findOne({ where: { id } }) || { teamName: 'Unknown' };
      const balance = (this.totalGoals(id, 'favor', 'home', matches)) - (this
        .totalGoals(id, 'against', 'home', matches));
      return { name: team.teamName,
        totalPoints: (this.totalPoints(id, matches)).homePoints,
        totalGames: (this.totalGames(id, matches)).totalHomeMatches,
        totalVictories: (this.totalVictories(id, matches)).homeVictories,
        totalDraws: this.totalDraws(id, 'home', matches),
        totalLosses: (this.totalLosses(id, matches)).homeLosses,
        goalsFavor: (this.totalGoals(id, 'favor', 'home', matches)),
        goalsOwn: (this.totalGoals(id, 'against', 'home', matches)),
        goalsBalance: balance,
        efficiency: Number((((this.totalPoints(id, matches)).homePoints / ((this
          .totalGames(id, matches)).totalHomeMatches * 3)) * 100).toFixed(2)) };
    })); return { message: this.sortLeaderboard(calculate) };
  };

  public getAwayLeaderboard = async () => {
    const ids = await this.getTeamsIds();
    const calculate = await Promise.all(ids.map(async (id) => {
      const matches = await this.getMatches(id);
      const team = await TeamsModel.findOne({ where: { id } }) || { teamName: 'Unknown' };
      const balance = (this.totalGoals(id, 'favor', 'away', matches)) - (this
        .totalGoals(id, 'against', 'away', matches));
      return { name: team.teamName,
        totalPoints: (this.totalPoints(id, matches)).awayPoints,
        totalGames: (this.totalGames(id, matches)).totalAwayMatches,
        totalVictories: (this.totalVictories(id, matches)).awayVictories,
        totalDraws: this.totalDraws(id, 'away', matches),
        totalLosses: (this.totalLosses(id, matches)).awayLosses,
        goalsFavor: (this.totalGoals(id, 'favor', 'away', matches)),
        goalsOwn: (this.totalGoals(id, 'against', 'away', matches)),
        goalsBalance: balance,
        efficiency: Number((((this.totalPoints(id, matches)).awayPoints / ((this
          .totalGames(id, matches)).totalAwayMatches * 3)) * 100).toFixed(2)) };
    })); return { message: this.sortLeaderboard(calculate) };
  };

  public getGeneralLeaderboard = async () => {
    const ids = await this.getTeamsIds();
    const calculate = await Promise.all(ids.map(async (id) => {
      const matches = await this.getMatches(id);
      const team = await TeamsModel.findOne({ where: { id } }) || { teamName: 'Unknown' };
      return { name: team.teamName,
        totalPoints: (this.totalPoints(id, matches)).allPoints,
        totalGames: (this.totalGames(id, matches)).totalMatches,
        totalVictories: (this.totalVictories(id, matches)).totalVictories,
        totalDraws: this.totalGeneralDraws(id, matches),
        totalLosses: (this.totalLosses(id, matches)).totalLosses,
        goalsFavor: this.totalGoalsFavor(id, matches),
        goalsOwn: this.totalGoalsAgainst(id, matches),
        goalsBalance: this.totalGoalsFavor(id, matches) - this
          .totalGoalsAgainst(id, matches),
        efficiency: Number((((this.totalPoints(id, matches)).allPoints / ((this
          .totalGames(id, matches)).totalMatches * 3)) * 100).toFixed(2)),
      };
    })); return { message: this.sortLeaderboard(calculate) };
  };

  public sortLeaderboard = (leaderboard: ILeaderBoard[]) => {
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
