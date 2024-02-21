import { AuthUser } from '@/core/application/auth/auth';
import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { BcryptAdapter } from '@/infra/adapters/bcrypt-adapter';
import { JwtAdapter } from '@/infra/adapters/jwt-adapter';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import {
  makeUserMongoRepository,
  makeFakeUser,
} from '@/test/mock/db-mock-helper-user';
import { ConfigService } from '@nestjs/config';

type SutTypes = {
  sut: AuthUser;
  userRepository: UserMongoRepository;
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

  const userRepository = makeUserMongoRepository();
  const hasher = new BcryptAdapter(configServiceMock as ConfigService);
  const encrypter = new JwtAdapter(configServiceMock as ConfigService);

  jest.spyOn(hasher, 'compare').mockReturnValue(Promise.resolve(true));
  jest.spyOn(encrypter, 'encrypt').mockReturnValue(Promise.resolve('hashed'));

  const sut = new AuthUser(userRepository, hasher, encrypter);

  return {
    sut,
    userRepository,
    hasher,
    encrypter,
  };
};

describe('AuthUser usecase', () => {
  test('Should return name and accessToken with success authentication', async () => {
    const { sut, userRepository } = makeSut();
    jest
      .spyOn(userRepository, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(makeFakeUser()));

    const response = await sut.auth(
      makeFakeUser().email,
      makeFakeUser().password,
    );

    expect(response.name).toBe(makeFakeUser().name);
    expect(response.accessToken).toBe('hashed');
  });

  test('Should return null if email is not matching', async () => {
    const { sut, userRepository } = makeSut();

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockReturnValueOnce(Promise.resolve(null));

    const response = await sut.auth(
      makeFakeUser().email,
      makeFakeUser().password,
    );

    expect(response).toBe(null);
  });
});
