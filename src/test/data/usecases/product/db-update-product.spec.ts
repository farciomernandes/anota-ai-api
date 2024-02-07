import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import { ProxySendMessage } from '@/data/protocols/sns/send-message';
import { ProductMongoRepository } from '@/infra/db/mongodb/product/product-mongo-repository';

import { DbUpdateProduct } from '../../../../data/usecases/product/db-update-product';
import { ConfigService } from '@nestjs/config';
import {
  makeFakeProduct,
  makeProductMongoRepository,
} from '@/test/mock/db-mock-helper-product';

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
    await sut.update('valid_id', makeFakeProduct());
    expect(updateSpy).toHaveBeenCalledWith('valid_id', makeFakeProduct());
  });

  test('Should throws if DbUpdateProduct throws', async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    jest
      .spyOn(updateProductRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.update('any_id', makeFakeProduct());
    expect(promise).rejects.toThrow();
  });
});
