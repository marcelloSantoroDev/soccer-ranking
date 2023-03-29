import { Request, Response } from 'express';
import teamsService from '../services/teamsService';

// export default { getAll };

export default class TeamsController {
  private service: teamsService;
  constructor(service: teamsService) {
    this.service = service;
  }

  public getAll = async (_req: Request, res: Response) => {
    const { message } = await this.service.getAll();
    return res.status(200).json(message);
  };
}
