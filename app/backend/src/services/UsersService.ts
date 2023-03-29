import UsersModel from '../database/models/UsersModel';

export default class UsersService {
  public login = async (email: string) => {
    const user = await UsersModel.findOne({ where: { email } });
    if (!user) return { type: 'NOT_FOUND', message: 'User not found' };
    return { type: null, message: '' };
  };
}
