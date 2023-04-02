import TeamsModel from '../database/models/TeamsModel';
import { ITeamsService } from '../interfaces';

export default class TeamsService implements ITeamsService {
  public getAll = async () => {
    const teams = await TeamsModel.findAll();
    return { message: teams };
  };

  public getById = async (id: number) => {
    const team = await TeamsModel.findOne({ where: { id } });
    return { message: team };
  };
}
