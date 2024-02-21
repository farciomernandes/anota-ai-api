/* eslint-disable @typescript-eslint/no-namespace */
import { AuthUser } from '@/core/application/auth/auth';
import { Decrypter } from '@/core/domain/protocols/cryptography/decrypter';
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
        // add throw unauthorized
        console.error(error.message);
      }
    }

    next();
  }
}
