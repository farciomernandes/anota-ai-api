import {
  makeAdminMongoRepository,
  makeFakeAdmin,
} from '@/test/mock/db-mock-helper-admin';
import { makeFakeRoles } from '@/test/mock/db-mock-helper-role';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { AdminMongoRepository } from '@/infra/db/mongodb/admin/admin-mongo-repository';
import { DbDeleteAdmin } from '@/core/application/admin/db-delete-admin';

type SutTypes = {
  sut: DbDeleteAdmin;
  deleteAdminRepositoryStub: AdminMongoRepository;
};

const makeSut = (): SutTypes => {
  const deleteAdminRepositoryStub = makeAdminMongoRepository();
  const sut = new DbDeleteAdmin(deleteAdminRepositoryStub);

  return {
    sut,
    deleteAdminRepositoryStub,
  };
};
describe('DbDeleteAdmin usecase', () => {
  test('Should call Delete on AdminMongoRepository with correct values', async () => {
    const { sut, deleteAdminRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteAdminRepositoryStub, 'delete');
    await sut.delete(makeFakeAdmin().id, {
      id: makeFakeAdmin().id,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.ADMIN,
      },
    });
    expect(deleteSpy).toBeCalledWith(makeFakeAdmin().id);
  });

  test('Should call findById AdminMongoRepository with correct value', async () => {
    const { sut, deleteAdminRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(deleteAdminRepositoryStub, 'findById');
    await sut.delete(makeFakeAdmin().id, {
      id: makeFakeAdmin().id,
      roles: {
        ...makeFakeRoles(),
        value: RolesEnum.ADMIN,
      },
    });
    expect(findSpy).toBeCalledWith(makeFakeAdmin().id);
  });

  test('Shoul call delete AdminMongoRepository with succes if roles is ADMIN', async () => {
    const { sut, deleteAdminRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteAdminRepositoryStub, 'delete');
    await sut.delete(makeFakeAdmin().id, {
      id: 'admin-id',
      roles: makeFakeRoles(),
    });

    expect(deleteSpy).toHaveBeenCalledWith(makeFakeAdmin().id);
  });
});
