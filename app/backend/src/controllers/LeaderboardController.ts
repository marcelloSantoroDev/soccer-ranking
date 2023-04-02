import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

interface ILeaderboardBody {
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

interface ILeaderboardController {
  getHomeLeaderboard(req: Request, res: Response): Promise<Response<ILeaderboardBody[]>>;
  getAwayLeaderboard(_req: Request, res: Response): Promise<Response<ILeaderboardBody[]>>;
  getGeneralLeaderboard(_req: Request, res: Response): Promise<Response<ILeaderboardBody[]>>;
}

export default class MatchesController implements ILeaderboardController {
  private service: LeaderboardService;
  constructor(service: LeaderboardService) {
    this.service = service;
  }

  public getHomeLeaderboard = async (_req: Request, res: Response) => {
    const { message } = await this.service.getHomeLeaderboard();
    return res.status(200).json(message);
  };

  public getAwayLeaderboard = async (_req: Request, res: Response) => {
    const { message } = await this.service.getAwayLeaderboard();
    return res.status(200).json(message);
  };

  public getGeneralLeaderboard = async (_req: Request, res: Response) => {
    const { message } = await this.service.getGeneralLeaderboard();
    return res.status(200).json(message);
  };
}
