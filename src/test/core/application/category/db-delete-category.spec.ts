import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';

import { DbDeleteCategory } from '@/core/application/category/db-delete-category';
import {
  makeCategoryMongoRepository,
  makeFakeCategory,
} from '@/test/mock/db-mock-helper-category';
import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { UnauthorizedException } from '@nestjs/common';

type SutTypes = {
  sut: DbDeleteCategory;
  deleteCategoryRepositoryStub: CategoryMongoRepository;
};

const makeSut = (): SutTypes => {
  const deleteCategoryRepositoryStub = makeCategoryMongoRepository();
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
    await sut.delete(makeFakeCategory().id, {
      id: makeFakeCategory().ownerId,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });
    expect(deleteSpy).toBeCalledWith(makeFakeCategory().id);
  });

  test('Should call findById CategoryMongoRepository with correct value', async () => {
    const { sut, deleteCategoryRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(deleteCategoryRepositoryStub, 'findById');
    await sut.delete(makeFakeCategory().id, {
      id: makeFakeCategory().ownerId,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });
    expect(findSpy).toBeCalledWith(makeFakeCategory().ownerId);
  });

  test('Shoul call delete CategoryMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, deleteCategoryRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteCategoryRepositoryStub, 'delete');
    await sut.delete(makeFakeCategory().id, {
      id: 'admin-id',
      roles: makeFakeRoles(),
    });

    expect(deleteSpy).toHaveBeenCalledWith(makeFakeCategory().id);
  });

  test('Should throw UnauthorizedException if category ownerId not matching if userId sended', async () => {
    const { sut } = makeSut();

    const promise = sut.delete(makeFakeCategory().id, {
      id: 'invalid_id',
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });

    await expect(promise).rejects.toThrowError(UnauthorizedException);
  });
});
