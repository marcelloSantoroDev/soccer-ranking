import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private service: MatchesService;
  constructor(service: MatchesService) {
    this.service = service;
  }

  public getAll = async (_req: Request, res: Response) => {
    const { message } = await this.service.getAll();
    return res.status(200).json(message);
  };
}
