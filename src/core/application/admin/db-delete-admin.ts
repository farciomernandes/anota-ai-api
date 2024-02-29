import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { MessagesHelper } from '@/shared/helpers/messages.helper';
import { IDbDeleteAdminRepository } from '@/core/domain/protocols/db/admin/delete-admin-respository';
import { AdminModel } from '@/core/domain/models/admin';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { AdminRepository } from '@/core/domain/repositories/admin-repository';

@Injectable()
export class DbDeleteAdmin implements IDbDeleteAdminRepository {
  constructor(private readonly adminMongoRepository: AdminRepository) {}
  async delete(id: string, user: Authenticated): Promise<AdminModel> {
    const admin = await this.adminMongoRepository.findById(id);

    if (admin.id !== user.id && user.roles.value !== RolesEnum.ADMIN) {
      throw new UnauthorizedException(MessagesHelper.NOT_AUTHORIZATION);
    }

    const adminUpdated = await this.adminMongoRepository.delete(id);

    return adminUpdated;
  }
}
