import { Module } from '@nestjs/common';
import { RoleMongoRepository } from '../db/mongodb/role/role-mongo-repository';
import { IDbAddRoleRepository } from '@/core/domain/protocols/db/role/add-role-repository';
import { IDbListRoleRepository } from '@/core/domain/protocols/db/role/list-role-respository';
import { DbAddRole } from '@/core/application/role/db-add-role';
import { DbListRole } from '@/core/application/role/db-list-role';
import { RoleController } from '@/presentation/controllers/role/role-controller';

@Module({
  imports: [],
  providers: [
    RoleMongoRepository,
    DbAddRole,
    DbListRole,
    {
      provide: IDbAddRoleRepository,
      useClass: DbAddRole,
    },
    {
      provide: IDbListRoleRepository,
      useClass: DbListRole,
    },
  ],
  controllers: [RoleController],
  exports: [IDbAddRoleRepository, IDbListRoleRepository],
})
export class RoleModule {}
