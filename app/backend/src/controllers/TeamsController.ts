import { Request, Response } from 'express';
import { IGetAllTeams } from '../interfaces';

export interface ITeamService {
  getAll(): IGetAllTeams
}

export default class TeamsController {
  constructor(private service: ITeamService) {}

  public async getAll(_req: Request, res: Response) {
    const message = await this.service.getAll();
    return res.status(200).json(message);
  }
}
