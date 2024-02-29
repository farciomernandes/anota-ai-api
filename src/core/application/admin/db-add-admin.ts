import { BadRequestException, Injectable } from '@nestjs/common';
import { IHasher } from '../../domain/protocols/cryptography/hasher';
import { AdminModel } from '@/core/domain/models/admin';
import { IDbAddAdminRepository } from '@/core/domain/protocols/db/admin/add-admin-repository';
import { AddAdmin } from '@/presentation/dtos/admin/add-admin';
import { AdminRepository } from '@/core/domain/repositories/admin-repository';

@Injectable()
export class DbAddAdmin implements IDbAddAdminRepository {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly hasher: IHasher,
  ) {}

  async create(payload: AddAdmin): Promise<AdminModel> {
    const alreadyExists = await this.adminRepository.findByEmail(payload.email);

    if (alreadyExists && alreadyExists.id) {
      throw new BadRequestException(
        `Already exists a Admin with ${payload.email} email.`,
      );
    }
    const password_hash = await this.hasher.hash(payload.password);
    const adminCreated = await this.adminRepository.create({
      ...payload,
      password: password_hash,
    });

    return adminCreated;
  }
}
