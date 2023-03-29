import TeamsModel from '../database/models/TeamsModel';

const getAll = async () => {
  const teams = await TeamsModel.findAll();
  return { message: teams };
};

export default { getAll };
