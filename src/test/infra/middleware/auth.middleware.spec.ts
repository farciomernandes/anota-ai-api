import { Decrypter } from '@/core/domain/protocols/cryptography/decrypter';
import { JwtAdapter } from '@/infra/adapters/jwt-adapter';
import { AuthMiddleware } from '@/infra/middleware/auth.middleware';
import { RolesEnum } from '@/shared/enums/roles.enum';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { makeConfigServiceMock } from '../config/configService';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';

type SutTypes = {
  sut: AuthMiddleware;
  decrypter: Decrypter;
};

const makeSut = (): SutTypes => {
  const decrypter = new JwtAdapter(makeConfigServiceMock());
  const sut = new AuthMiddleware(decrypter);
  return {
    sut,
    decrypter,
  };
};

describe('AuthMiddleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should set user in request if valid token is provided', async () => {
    const { decrypter, sut } = makeSut();
    const token = 'valid_token';
    const user: Authenticated = {
      roles: [RolesEnum.ADMIN],
      id: 'valid_id',
    };

    const req: Request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any;

    const res: Response = {} as any;

    const next = jest.fn();

    jest
      .spyOn(decrypter, 'decrypt')
      .mockImplementationOnce(() => Promise.resolve(user));

    await sut.use(req, res, next);

    expect(decrypter.decrypt).toHaveBeenCalledWith(token);
    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalled();
  });

  test('Should throw InternalServerErrorException if decrypter fails', async () => {
    const { decrypter, sut } = makeSut();

    const token = 'invalid_token';

    const req: Request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any;

    const res: Response = {} as any;

    const next = jest.fn();

    const error = new Error('Decrypter error');

    jest
      .spyOn(decrypter, 'decrypt')
      .mockRejectedValueOnce(() => Promise.reject(error));

    const promise = sut.use(req, res, next);

    await expect(promise).rejects.toThrowError(InternalServerErrorException);
  });

  test('Should throw UnauthorizedException if token is missing', async () => {
    const { sut } = makeSut();

    const req: Request = {
      headers: {},
    } as any;

    const res: Response = {} as any;

    const next = jest.fn();

    const promise = sut.use(req, res, next);

    await expect(promise).rejects.toThrowError(UnauthorizedException);
    expect(req.user).toBeUndefined();
  });
});
