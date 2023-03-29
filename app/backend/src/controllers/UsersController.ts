import { Request, Response } from 'express';
import TokenGenerator from '../utils/TokenGenerator';
import UsersService from '../services/UsersService';

export default class TeamsController {
  private service: UsersService;
  constructor(service: UsersService) {
    this.service = service;
  }

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { type, message } = await this.service.login(email, password);

    if (type) return res.status(401).json({ message });

    const tokenGenerator = new TokenGenerator(email);
    const token = tokenGenerator.generate();

    return res.status(200).json({ token });
  };

  public role = async (req: Request, res: Response) => {
    const { role } = req.body.user;
    return res.status(200).json({ role });
  };
}
