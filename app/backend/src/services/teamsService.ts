import TeamsModel from '../database/models/TeamsModel';

// export default { getAll };

export default class teamsService {
  public getAll = async () => {
    const teams = await TeamsModel.findAll();
    return { message: teams };
  };
}
