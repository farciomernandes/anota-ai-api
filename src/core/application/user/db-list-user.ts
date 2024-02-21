import { IDbListUserRepository } from '@/core/domain/protocols/db/user/list-category-respository';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbListUser implements IDbListUserRepository {
  constructor(private readonly userMongoRepository: UserMongoRepository) {}

  async getAll(): Promise<any> {
    return this.userMongoRepository.getAll();
  }
}
