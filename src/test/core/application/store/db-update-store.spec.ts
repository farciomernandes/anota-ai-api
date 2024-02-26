import { ConfigService } from '@nestjs/config';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { DbUpdateStore } from '@/core/application/store/db-update-store';
import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import {
  makeStoreMongoRepository,
  makeFakeStore,
  makeFakeUpdateStore,
} from '@/test/mock/db-mock-helper-store';
import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { UnauthorizedException } from '@nestjs/common';

type SutTypes = {
  sut: DbUpdateStore;
  updatestoreRepositoryStub: StoreMongoRepository;
};

const makeSut = (): SutTypes => {
  const updatestoreRepositoryStub = makeStoreMongoRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);
  const sut = new DbUpdateStore(updatestoreRepositoryStub, snsProxyStub);

  return {
    sut,
    updatestoreRepositoryStub,
  };
};

describe('DbUpdate store', () => {
  test('Shoul call update StoreMongoRepository with correct values', async () => {
    const { sut, updatestoreRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updatestoreRepositoryStub, 'update');
    await sut.update('valid_id', makeFakeUpdateStore(), {
      id: makeFakeStore().id,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });
    expect(updateSpy).toHaveBeenCalledWith('valid_id', makeFakeUpdateStore());
  });

  test('Shoul call update StoreMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, updatestoreRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updatestoreRepositoryStub, 'update');
    await sut.update('valid_id', makeFakeUpdateStore(), {
      id: 'admin-id',
      roles: makeFakeRoles(),
    });
    expect(updateSpy).toHaveBeenCalledWith('valid_id', makeFakeUpdateStore());
  });

  test('Should throw UnauthorizedException if store ownerId not matching if userId sended', async () => {
    const { sut } = makeSut();

    const promise = sut.update('any_id', makeFakeUpdateStore(), {
      id: 'invalid_id',
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });

    await expect(promise).rejects.toThrowError(UnauthorizedException);
  });

  test('Should throws if StoreMongoRepository throws', async () => {
    const { sut, updatestoreRepositoryStub } = makeSut();
    jest
      .spyOn(updatestoreRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.update('any_id', makeFakeUpdateStore(), {
      id: makeFakeStore().id,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });
    expect(promise).rejects.toThrow();
  });
});
