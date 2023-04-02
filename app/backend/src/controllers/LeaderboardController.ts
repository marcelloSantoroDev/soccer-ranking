import { Request, Response } from 'express';
import { ILeaderboardService, ILeaderboardController } from '../interfaces';

export default class MatchesController implements ILeaderboardController {
  private service: ILeaderboardService;
  constructor(service: ILeaderboardService) {
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
