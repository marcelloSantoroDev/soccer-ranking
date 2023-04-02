import { Request, Response } from 'express';
import { ITeamsController, ITeamsService } from '../interfaces';

export default class TeamsController implements ITeamsController {
  private service: ITeamsService;
  constructor(service: ITeamsService) {
    this.service = service;
  }

  public getAll = async (_req: Request, res: Response) => {
    const { message } = await this.service.getAll();
    return res.status(200).json(message);
  };

  public getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { message } = await this.service.getById(id);
    return res.status(200).json(message);
  };
}
