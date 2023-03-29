import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  private service: TeamsService;
  constructor(service: TeamsService) {
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
