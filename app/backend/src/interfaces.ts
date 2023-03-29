import { Request, Response } from 'express';

export interface IGetAllTeams {
  id: number;
  teamName: string;
}

export default interface ITeamsController {
  getAll(req: Request, res: Response): Response<IGetAllTeams[]>
}
