import * as bcrypt from 'bcryptjs';
import UsersModel from '../database/models/UsersModel';
import { IUsersService } from '../interfaces';

export default class UsersService implements IUsersService {
  public login = async (email: string, password: string) => {
    const user = await UsersModel.findOne({ where: { email } });
    if (!user) return { type: 'NOT_FOUND', message: 'Invalid email or password' };

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return { type: 'NOT_FOUND', message: 'Invalid email or password' };

    return { type: null, message: '' };
  };
}
