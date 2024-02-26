import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';

import { DbDeleteProduct } from '@/core/application/product/db-delete-product';
import { ConfigService } from '@nestjs/config';
import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import {
  makeFakeProduct,
  makeProductMongoRepository,
} from '@/test/mock/db-mock-helper-product';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { UnauthorizedException } from '@nestjs/common';
import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';

type SutTypes = {
  sut: DbDeleteProduct;
  deleteProductRepositoryStub: ProductMongoRepository;
};

const makeSut = (): SutTypes => {
  const deleteProductRepositoryStub = makeProductMongoRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);

  const sut = new DbDeleteProduct(deleteProductRepositoryStub, snsProxyStub);

  return {
    sut,
    deleteProductRepositoryStub,
  };
};
describe('DbDeleteProduct usecase', () => {
  test('Should call ProductMongoRepository with correct values', async () => {
    const { sut, deleteProductRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteProductRepositoryStub, 'delete');
    await sut.delete(makeFakeProduct().id, {
      id: makeFakeProduct().ownerId,
      roles: makeFakeRoles(),
    });
    expect(deleteSpy).toBeCalledWith(makeFakeProduct().id);
  });

  test('Shoul call delete ProductMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, deleteProductRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteProductRepositoryStub, 'delete');
    await sut.delete(makeFakeProduct().id, {
      id: 'admin-id',
      roles: makeFakeRoles(),
    });

    expect(deleteSpy).toHaveBeenCalledWith(makeFakeProduct().id);
  });

  test('Should throw UnauthorizedException if product ownerId not matching if userId sended', async () => {
    const { sut } = makeSut();

    const promise = sut.delete(makeFakeProduct().id, {
      id: 'invalid_id',
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });

    await expect(promise).rejects.toThrowError(UnauthorizedException);
  });
});
