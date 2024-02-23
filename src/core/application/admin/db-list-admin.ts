import { IDbListAdminRepository } from '@/core/domain/protocols/db/admin/list-admin-respository';
import { AdminMongoRepository } from '@/infra/db/mongodb/admin/admin-mongo-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbListAdmin implements IDbListAdminRepository {
  constructor(private readonly adminMongoRepository: AdminMongoRepository) {}

  async getAll(): Promise<any> {
    return this.adminMongoRepository.getAll();
  }
}
