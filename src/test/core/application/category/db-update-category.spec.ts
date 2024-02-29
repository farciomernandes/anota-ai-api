import { ConfigService } from '@nestjs/config';
import { DbUpdateCategory } from '@/core/application/category/db-update-category';
import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import {
  makeCategoryRepository,
  makeFakeCategory,
} from '@/test/mock/db-mock-helper-category';
import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { UnauthorizedException } from '@nestjs/common';
import { CategoryRepository } from '@/core/domain/repositories/category-repository';
import { makeFakeProductAuthenticatedAdmin } from '@/test/mock/db-mock-helper-product';

type SutTypes = {
  sut: DbUpdateCategory;
  updateCategoryRepositoryStub: CategoryRepository;
};

const makeSut = (): SutTypes => {
  const updateCategoryRepositoryStub = makeCategoryRepository();
  const snsProxyStub = makeSnsProxyMock({} as ConfigService);
  const sut = new DbUpdateCategory(updateCategoryRepositoryStub, snsProxyStub);

  return {
    sut,
    updateCategoryRepositoryStub,
  };
};

describe('DbUpdate Category', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Shoul call update CategoryMongoRepository with correct values', async () => {
    const { sut, updateCategoryRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateCategoryRepositoryStub, 'update');
    await sut.update(
      'valid_id',
      makeFakeCategory(),
      makeFakeProductAuthenticatedAdmin(),
    );
    expect(updateSpy).toHaveBeenCalledWith(
      'valid_id',
      makeFakeCategory(),
      makeFakeProductAuthenticatedAdmin(),
    );
  });

  test('Should call update CategoryMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, updateCategoryRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateCategoryRepositoryStub, 'update');
    await sut.update(
      'valid_id',
      makeFakeCategory(),
      makeFakeProductAuthenticatedAdmin(),
    );
    expect(updateSpy).toHaveBeenCalledWith(
      'valid_id',
      makeFakeCategory(),
      makeFakeProductAuthenticatedAdmin(),
    );
  });

  test('Should throw UnauthorizedException if category ownerId not matching if userId sended', async () => {
    const { sut } = makeSut();

    const promise = sut.update('any_id', makeFakeCategory(), {
      id: 'invalid_id',
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });

    await expect(promise).rejects.toThrowError(UnauthorizedException);
  });

  test('Should throws if CategoryMongoRepository throws', async () => {
    const { sut, updateCategoryRepositoryStub } = makeSut();
    jest
      .spyOn(updateCategoryRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolver, reject) => reject(new Error())),
      );
    const promise = sut.update('any_id', makeFakeCategory(), {
      id: makeFakeCategory().ownerId,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });
    expect(promise).rejects.toThrow();
  });
});
