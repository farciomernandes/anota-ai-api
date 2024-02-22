import { AuthStore } from '@/core/application/auth/auth';
import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { BcryptAdapter } from '@/infra/adapters/bcrypt-adapter';
import { JwtAdapter } from '@/infra/adapters/jwt-adapter';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import {
  makeFakeStore,
  makeStoreMongoRepository,
} from '@/test/mock/db-mock-helper-store';

import { ConfigService } from '@nestjs/config';

type SutTypes = {
  sut: AuthStore;
  storeRepository: StoreMongoRepository;
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

  const storeRepository = makeStoreMongoRepository();
  const hasher = new BcryptAdapter(configServiceMock as ConfigService);
  const encrypter = new JwtAdapter(configServiceMock as ConfigService);

  jest.spyOn(hasher, 'compare').mockReturnValue(Promise.resolve(true));
  jest.spyOn(encrypter, 'encrypt').mockReturnValue(Promise.resolve('hashed'));

  const sut = new AuthStore(storeRepository, hasher, encrypter);

  return {
    sut,
    storeRepository,
    hasher,
    encrypter,
  };
};

describe('AuthStore usecase', () => {
  test('Should return name and accessToken with success authentication', async () => {
    const { sut, storeRepository } = makeSut();
    jest
      .spyOn(storeRepository, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(makeFakeStore()));

    const response = await sut.auth(
      makeFakeStore().email,
      makeFakeStore().password,
    );

    expect(response.name).toBe(makeFakeStore().name);
    expect(response.accessToken).toBe('hashed');
  });

  test('Should return null if email is not matching', async () => {
    const { sut, storeRepository } = makeSut();

    jest
      .spyOn(storeRepository, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(null));

    const response = await sut.auth(
      makeFakeStore().email,
      makeFakeStore().password,
    );

    expect(response).toBe(null);
  });
});
