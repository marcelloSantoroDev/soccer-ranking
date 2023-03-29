import TeamsModel from '../database/models/TeamsModel';

export default class TeamsService {
  public static async getAll() {
    const teams = await TeamsModel.findAll();
    return teams;
  }
}
