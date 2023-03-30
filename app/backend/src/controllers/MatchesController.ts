import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private service: MatchesService;
  constructor(service: MatchesService) {
    this.service = service;
  }

  public getAll = async (req: Request, res: Response) => {
    const { inProgress } = req.query;
    if (inProgress === undefined) {
      const { message } = await this.service.getAll();
      return res.status(200).json(message);
    }

    const { message } = await this.service.getInProgress(inProgress as string);
    return res.status(200).json(message);
  };

  public finish = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const { message } = await this.service.finish(id);
      return res.status(200).json({ message });
    } catch (error) {
      return res.status(401).json({ message: error });
    }
  };
}
