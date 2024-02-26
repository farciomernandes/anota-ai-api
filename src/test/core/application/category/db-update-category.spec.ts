import { ConfigService } from '@nestjs/config';
import { CategoryMongoRepository } from '@/infra/db/mongodb/category/category-mongo-repository';
import { DbUpdateCategory } from '@/core/application/category/db-update-category';
import { makeSnsProxyMock } from '@/test/mock/sns-proxy-mock-helper';
import {
  makeCategoryMongoRepository,
  makeFakeCategory,
} from '@/test/mock/db-mock-helper-category';
import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { UnauthorizedException } from '@nestjs/common';

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
  test('Shoul call update CategoryMongoRepository with correct values', async () => {
    const { sut, updateCategoryRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateCategoryRepositoryStub, 'update');
    await sut.update('valid_id', makeFakeCategory(), {
      id: makeFakeCategory().ownerId,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.STORE,
      },
    });
    expect(updateSpy).toHaveBeenCalledWith('valid_id', makeFakeCategory());
  });

  test('Shoul call update CategoryMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, updateCategoryRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateCategoryRepositoryStub, 'update');
    await sut.update('valid_id', makeFakeCategory(), {
      id: 'admin-id',
      roles: makeFakeRoles(),
    });
    expect(updateSpy).toHaveBeenCalledWith('valid_id', makeFakeCategory());
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
