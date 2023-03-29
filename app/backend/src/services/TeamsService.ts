import TeamsModel from '../database/models/TeamsModel';

export default class TeamsService {
  public getAll = async () => {
    const teams = await TeamsModel.findAll();
    return { message: teams };
  };

  public getById = async (id: number) => {
    const team = await TeamsModel.findOne({ where: { id } });
    return { message: team };
  };
}
