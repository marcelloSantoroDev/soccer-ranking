import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

export default class TokenGenerator {
  private secret: string;

  private jwtConfig: SignOptions;

  private user: string;

  constructor(user: string) {
    this.secret = process.env.JWT_SECRET as string;
    this.jwtConfig = { expiresIn: '7d', algorithm: 'HS256' };
    this.user = user;
  }

  public generate = (): string => jwt.sign({ data: this.user }, this.secret, this.jwtConfig);
}
