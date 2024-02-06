import { ConfigService } from '@nestjs/config';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import {
  makeCategoryMongoRepository,
  makeFakeCategory,
} from '@/domain/test/mock/db-mock-helper-category';
import { DbUpdateCategory } from './db-update-category';
import { makeSnsProxyMock } from '@/domain/test/mock/sns-proxy-mock-helper';

type SutTypes = {
  sut: DbUpdateCategory;
  updateCategoryRepositoryStub: CategoryMongoRepository;
};

const makeSut = (): SutTypes => {
  const updateCategoryRepositoryStub = makeCategoryMongoRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);
  const sut = new DbUpdateCategory(updateCategoryRepositoryStub, snsProxyStub);

  return {
    sut,
    updateCategoryRepositoryStub,
  };
};

describe('DbUpdate Category', () => {
  test('Shoul call DbUpdateCategory with correct values', async () => {
    const { sut, updateCategoryRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateCategoryRepositoryStub, 'update');
    await sut.update('valid_id', makeFakeCategory());
    expect(updateSpy).toHaveBeenCalledWith('valid_id', makeFakeCategory());
  });

  test('Should throws if DbUpdateCategory throws', async () => {
    const { sut, updateCategoryRepositoryStub } = makeSut();
    jest
      .spyOn(updateCategoryRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.update('any_id', makeFakeCategory());
    expect(promise).rejects.toThrow();
  });
});
