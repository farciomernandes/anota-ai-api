import { AuthAdmin } from '@/core/application/auth/auth-admin';
import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { BcryptAdapter } from '@/infra/adapters/bcrypt-adapter';
import { JwtAdapter } from '@/infra/adapters/jwt-adapter';
import { AdminMongoRepository } from '@/infra/db/mongodb/admin/admin-mongo-repository';
import {
  makeFakeAdmin,
  makeAdminMongoRepository,
} from '@/test/mock/db-mock-helper-admin';
import { BadRequestException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

type SutTypes = {
  sut: AuthAdmin;
  adminRepository: AdminMongoRepository;
  hasher: HashComparer;
  encrypter: Encrypter;
};

const makeConfigServiceMock = () => {
  function get(text: string): string {
    let value;

    switch (text) {
      case 'SALT':
        value = 12;
      case 'SECRET_KEY':
        value = 'any_secret_key';
      default:
        value = '';
    }

    return value;
  }

  return {
    get,
  };
};

const makeSut = (): SutTypes => {
  const configServiceMock = makeConfigServiceMock();

  const adminRepository = makeAdminMongoRepository();
  const hasher = new BcryptAdapter(configServiceMock as ConfigService);
  const encrypter = new JwtAdapter(configServiceMock as ConfigService);

  jest.spyOn(hasher, 'compare').mockReturnValue(Promise.resolve(true));
  jest.spyOn(encrypter, 'encrypt').mockReturnValue(Promise.resolve('hashed'));

  const sut = new AuthAdmin(adminRepository, hasher, encrypter);

  return {
    sut,
    adminRepository,
    hasher,
    encrypter,
  };
};

describe('AuthAdmin usecase', () => {
  test('Should return name and accessToken with success authentication', async () => {
    const { sut, adminRepository } = makeSut();
    jest
      .spyOn(adminRepository, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(makeFakeAdmin()));

    const response = await sut.auth(
      makeFakeAdmin().email,
      makeFakeAdmin().password,
    );

    expect(response.name).toBe(makeFakeAdmin().name);
    expect(response.accessToken).toBe('hashed');
  });

  test('Should return BadRequestException if email is not matching', async () => {
    const { sut, adminRepository } = makeSut();

    jest
      .spyOn(adminRepository, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(null));

    const promise = sut.auth(makeFakeAdmin().email, makeFakeAdmin().password);

    await expect(promise).rejects.toThrowError(BadRequestException);
  });
});
