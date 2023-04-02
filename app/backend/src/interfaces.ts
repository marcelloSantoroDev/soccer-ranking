import { Request, Response } from 'express';
import MatchesModel from './database/models/MatchesModel';
import TeamsModel from './database/models/TeamsModel';

export interface IGetAllTeams {
  id: number;
  teamName: string;
}

export interface ITeamsController {
  getAll(req: Request, res: Response): Promise<Response<IGetAllTeams[]>>;
  getById(req: Request, res: Response): Promise<Response<IGetAllTeams>>;
}

interface ITeamsServiceMethodsReturns {
  message: TeamsModel[]
}

export interface ITeamsService {
  getAll(): Promise<ITeamsServiceMethodsReturns>;
  getById(id: number): Promise<{ message: TeamsModel | null }>;
}

export interface IUpdateMatchBody {
  id: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface ICreateMatchBody {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface IMatch {
  'id': number,
  'homeTeamId': number,
  'homeTeamGoals': number,
  'awayTeamId': number,
  'awayTeamGoals': number,
  'inProgress': boolean,
  'homeTeam': {
    'teamName': string,
  },
  'awayTeam': {
    'teamName': string,
  }
}

interface ICreatedMatch {
  'id': number,
  'homeTeamId': number,
  'awayTeamId': number,
  'homeTeamGoals': number,
  'awayTeamGoals': number,
  'inProgress': boolean
}

interface IMatchBody {
  message: string | Error;
}

export interface IMatchesController {
  getAll(req: Request, res: Response): Promise<Response<IMatch[]>>;
  finish(req: Request, res: Response): Promise<Response<IMatchBody>>;
  update(req: Request, res: Response): Promise<Response<IMatchBody>>;
  create(req: Request, res: Response): Promise<Response<ICreatedMatch>>;
}

interface IMatchesMethodsReturns {
  type?: string | undefined;
  message: MatchesModel[] | MatchesModel | string;
}

interface IUpdate {
  id: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface IMatchesService {
  getAll(): Promise<IMatchesMethodsReturns>;
  getInProgress(inProgress: string): Promise<IMatchesMethodsReturns>;
  finish(id: number): Promise<IMatchesMethodsReturns>;
  update(object: IUpdate): Promise<IMatchesMethodsReturns>;
  create(object: ICreateMatchBody): Promise<IMatchesMethodsReturns>;
}

export interface IGetMatches {
  finishedHomeMatches: Promise<IMatch[]>;
  finishedAwayMatches: Promise<IMatch[]>
}

export interface ILeaderBoard {
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

interface IGetAllMatches {
  finishedHomeMatches: MatchesModel[];
  finishedAwayMatches: MatchesModel[];
}

interface ITotalPoints {
  homePoints: number;
  awayPoints: number;
  allPoints: number;
}

interface ITotalGames {
  totalHomeMatches: number;
  totalAwayMatches: number;
  totalMatches: number;
}

interface ITotalVictories {
  homeVictories: number;
  awayVictories: number;
  totalVictories: number;
}

interface ITotalLosses {
  homeLosses: number;
  awayLosses: number;
  totalLosses: number;
}

export interface ILeaderboardBody {
  'name': string,
  'totalPoints': number,
  'totalGames': number,
  'totalVictories': number,
  'totalDraws': number,
  'totalLosses': number,
  'goalsFavor': number,
  'goalsOwn': number,
  'goalsBalance': number,
  'efficiency': number
}

export interface ILeaderboardService {
  getMatches(id: number): Promise<IGetAllMatches>;
  totalPoints(id: number): Promise<ITotalPoints>;
  totalGames(id: number): Promise<ITotalGames>;
  totalVictories(id: number): Promise<ITotalVictories>;
  totalDraws(id: number, where: string): Promise<number>;
  totalGeneralDraws(id: number): Promise<number>;
  totalLosses(id: number): Promise<ITotalLosses>;
  totalGoals(id: number, type: string, where: string): Promise<number>;
  totalGoalsFavor(id: number): Promise<number>;
  totalGoalsAgainst(id: number): Promise<number>;
  getTeamsIds(): Promise<number[]>;
  getHomeLeaderboard(): Promise<{ message: ILeaderboardBody[] }>;
  getAwayLeaderboard(): Promise<{ message: ILeaderboardBody[] }>;
  sortedLeaderboard(leaderboard: ILeaderBoard[]): ILeaderboardBody[];
  getGeneralLeaderboard(): Promise<{ message: ILeaderboardBody[] }>;
}

export interface ILeaderboardController {
  getHomeLeaderboard(req: Request, res: Response): Promise<Response<ILeaderboardBody[]>>;
  getAwayLeaderboard(_req: Request, res: Response): Promise<Response<ILeaderboardBody[]>>;
  getGeneralLeaderboard(_req: Request, res: Response): Promise<Response<ILeaderboardBody[]>>;
}
