import { DbDeleteCategory } from '@/core/application/category/db-delete-category';
import {
  makeCategoryRepository,
  makeFakeCategory,
} from '@/test/mock/db-mock-helper-category';
import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { UnauthorizedException } from '@nestjs/common';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';
import {
  makeFakeProductAuthenticatedAdmin,
  makeFakeProductAuthenticatedStore,
} from '@/test/mock/db-mock-helper-product';

type SutTypes = {
  sut: DbDeleteCategory;
  deleteCategoryRepositoryStub: CategoryRepository;
};

const makeSut = (): SutTypes => {
  const deleteCategoryRepositoryStub = makeCategoryRepository();
  const sut = new DbDeleteCategory(deleteCategoryRepositoryStub);

  return {
    sut,
    deleteCategoryRepositoryStub,
  };
};
describe('DbDeleteCategory usecase', () => {
  test('Should call Delete on CategoryMongoRepository with correct values', async () => {
    const { sut, deleteCategoryRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteCategoryRepositoryStub, 'delete');
    await sut.delete(
      makeFakeCategory().id,
      makeFakeProductAuthenticatedAdmin(),
    );
    expect(deleteSpy).toBeCalledWith(
      makeFakeCategory().id,
      makeFakeProductAuthenticatedAdmin(),
    );
  });

  test('Should call findById CategoryMongoRepository with correct value', async () => {
    const { sut, deleteCategoryRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(deleteCategoryRepositoryStub, 'findById');
    await sut.delete(
      makeFakeCategory().id,
      makeFakeProductAuthenticatedAdmin(),
    );
    expect(findSpy).toBeCalledWith(makeFakeCategory().ownerId),
      makeFakeProductAuthenticatedAdmin();
  });

  test('Shoul call delete CategoryMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, deleteCategoryRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteCategoryRepositoryStub, 'delete');
    await sut.delete(
      makeFakeCategory().id,
      makeFakeProductAuthenticatedAdmin(),
    );

    expect(deleteSpy).toHaveBeenCalledWith(
      makeFakeCategory().id,
      makeFakeProductAuthenticatedAdmin(),
    );
  });

  test('Should throw UnauthorizedException if category ownerId not matching if userId sended', async () => {
    const { sut } = makeSut();

    const promise = sut.delete(
      makeFakeCategory().id,
      makeFakeProductAuthenticatedStore(),
    );

    await expect(promise).rejects.toThrowError(UnauthorizedException);
  });
});
