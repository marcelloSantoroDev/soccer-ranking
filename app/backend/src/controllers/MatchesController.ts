import { Request, Response } from 'express';
import { IMatchesController, IMatchesService } from '../interfaces';

export default class MatchesController implements IMatchesController {
  private service: IMatchesService;
  constructor(service: IMatchesService) {
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

  public update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { homeTeamGoals, awayTeamGoals } = req.body;
    try {
      const { message } = await this.service.update({ id, homeTeamGoals, awayTeamGoals });
      return res.status(200).json({ message });
    } catch (error) {
      return res.status(401).json({ message: error });
    }
  };

  public create = async (req: Request, res: Response) => {
    const {
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
    } = req.body;
    try {
      const { type, message } = await this.service.create({
        homeTeamId,
        awayTeamId,
        homeTeamGoals,
        awayTeamGoals,
      });
      if (type) return res.status(404).json({ message });
      return res.status(201).json(message);
    } catch (error) {
      return res.status(401).json({ message: error });
    }
  };
}
