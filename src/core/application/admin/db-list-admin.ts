import { AdminModel } from '@/core/domain/models/admin';
import { IDbListAdminRepository } from '@/core/domain/protocols/db/admin/list-admin-respository';
import { AdminRepository } from '@/core/domain/repositories/admin-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbListAdmin implements IDbListAdminRepository {
  constructor(private readonly adminMongoRepository: AdminRepository) {}

  async getAll(): Promise<AdminModel[]> {
    return this.adminMongoRepository.getAll();
  }
}
