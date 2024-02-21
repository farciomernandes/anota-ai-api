/* eslint-disable @typescript-eslint/no-namespace */
import { Decrypter } from '@/data/protocols/cryptography/decrypter';
import { AuthUser } from '@/data/usecases/user/auth';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly decrypter: Decrypter) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
      try {
        const user = await this.decrypter.decrypt(token);

        req.user = user;
      } catch (error) {
        console.error(error.message);
      }
    }

    next();
  }
}
