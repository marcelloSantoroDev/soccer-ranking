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

export interface ICreateMatchBody {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface IMatch {
  'id': number,
  'homeTeamId': number,
  'homeTeamGoals': number,
  'awayTeamId': number,
  'awayTeamGoals': number,
  'inProgress': boolean,
  'homeTeam': {
    'teamName': string,
  },
  'awayTeam': {
    'teamName': string,
  }
}

export interface IGetMatches {
  finishedHomeMatches: Promise<IMatch[]>;
  finishedAwayMatches: Promise<IMatch[]>
}

export default interface ITeamsController {
  getAll(req: Request, res: Response): Response<IGetAllTeams[]>
}
