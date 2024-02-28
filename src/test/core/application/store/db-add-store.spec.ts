import { DbAddStore } from '@/core/application/store/db-add-store';
import { IHasher } from '@/core/domain/protocols/cryptography/hasher';
import { BcryptAdapter } from '@/infra/adapters/bcrypt-adapter';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { makeConfigServiceMock } from '@/test/infra/config/configService';
import {
  makeFakePaymentMethod,
  makeFakeStore,
  makeFakeWeek,
  makeRequestAddStore,
  makeStoreFakeRequest,
  makeStoreMongoRepository,
} from '@/test/mock/db-mock-helper-store';
import { makeS3UploadImageMock } from '@/test/mock/s3-mock-helper';

import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type SutTypes = {
  sut: DbAddStore;
  addStoreRepositoryStub: StoreMongoRepository;
  hasher: IHasher;
};

const makeSut = (): SutTypes => {
  const addStoreRepositoryStub = makeStoreMongoRepository();
  const hasher = new BcryptAdapter(new ConfigService());
  const S3Stub = makeS3UploadImageMock();
  const configServiceMock = makeConfigServiceMock();
  const sut = new DbAddStore(
    addStoreRepositoryStub,
    hasher,
    S3Stub,
    configServiceMock,
  );

  return {
    sut,
    addStoreRepositoryStub,
    hasher,
  };
};

describe('DbAddStore usecase', () => {
  test('Should call create and hasher with correct values', async () => {
    const { sut, addStoreRepositoryStub, hasher } = makeSut();

    const hashSpy = jest
      .spyOn(hasher, 'hash')
      .mockReturnValueOnce(Promise.resolve('hashed_password'));

    const repositorySpy = jest.spyOn(addStoreRepositoryStub, 'create');
    await sut.create(makeRequestAddStore());

    expect(hashSpy).toHaveBeenCalledWith(makeRequestAddStore().password);

    expect(repositorySpy).toHaveBeenCalledWith({
      ...makeStoreFakeRequest(),
      password: 'hashed_password',
      roleId: '65b9a4cd77e2de47acb5db37',
      file: null,
    });
  });

  test('Should throw BadRequestException if email already exists!', async () => {
    const { sut, addStoreRepositoryStub } = makeSut();

    jest
      .spyOn(addStoreRepositoryStub, 'findByEmail')
      .mockResolvedValueOnce(Promise.resolve(makeFakeStore()));

    const promise = sut.create(makeRequestAddStore());
    await expect(promise).rejects.toThrow(BadRequestException);
    await expect(promise).rejects.toThrowError(
      `Already exists a Store with ${makeRequestAddStore().email} email.`,
    );
  });

  test('Should returns throw if usecase throws', async () => {
    const { sut } = makeSut();

    jest
      .spyOn(sut, 'create')
      .mockResolvedValueOnce(Promise.reject(new Error()));

    const promise = sut.create(makeRequestAddStore());
    await expect(promise).rejects.toThrow();
  });
});
