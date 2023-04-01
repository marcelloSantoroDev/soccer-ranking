import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class MatchesController {
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
}
