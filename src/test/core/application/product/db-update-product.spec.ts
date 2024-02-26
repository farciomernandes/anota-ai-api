import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';

import { DbUpdateProduct } from '@/core/application/product/db-update-product';
import { ConfigService } from '@nestjs/config';
import {
  makeFakeProduct,
  makeProductMongoRepository,
} from '@/test/mock/db-mock-helper-product';
import { ProxySendMessage } from '@/core/domain/protocols/aws/sns-send-message';
import { UnauthorizedException } from '@nestjs/common';
import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';
import { RolesEnum } from '@/shared/enums/roles.enum';

type SutTypes = {
  sut: DbUpdateProduct;
  updateProductRepositoryStub: ProductMongoRepository;
  snsProxyStub: ProxySendMessage;
};

const makeSut = (): SutTypes => {
  const updateProductRepositoryStub = makeProductMongoRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);

  const sut = new DbUpdateProduct(updateProductRepositoryStub, snsProxyStub);

  return {
    sut,
    updateProductRepositoryStub,
    snsProxyStub,
  };
};

describe('DbUpdate Product', () => {
  test('Shoul call DbUpdateProduct with correct values', async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateProductRepositoryStub, 'update');
    await sut.update('valid_id', makeFakeProduct(), {
      id: makeFakeProduct().ownerId,
      roles: makeFakeRoles(),
    });
    expect(updateSpy).toHaveBeenCalledWith('valid_id', makeFakeProduct());
  });

  test('Shoul call update ProductMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateProductRepositoryStub, 'update');
    await sut.update('valid_id', makeFakeProduct(), {
      id: 'admin-id',
      roles: makeFakeRoles(),
    });
    expect(updateSpy).toHaveBeenCalledWith('valid_id', makeFakeProduct());
  });

  test('Should throw UnauthorizedException if Product ownerId not matching if userId sended', async () => {
    const { sut } = makeSut();

    const promise = sut.update('any_id', makeFakeProduct(), {
      id: 'invalid_id',
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });

    await expect(promise).rejects.toThrowError(UnauthorizedException);
  });

  test('Should throws if DbUpdateProduct throws', async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    jest
      .spyOn(updateProductRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.update('any_id', makeFakeProduct(), {
      id: makeFakeProduct().ownerId,
      roles: makeFakeRoles(),
    });
    expect(promise).rejects.toThrow();
  });
});
