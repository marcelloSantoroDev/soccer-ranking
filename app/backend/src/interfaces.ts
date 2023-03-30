import { Request, Response } from 'express';

export interface IGetAllTeams {
  id: number;
  teamName: string;
}

export interface IUpdateMatchBody {
  id: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export default interface ITeamsController {
  getAll(req: Request, res: Response): Response<IGetAllTeams[]>
}
