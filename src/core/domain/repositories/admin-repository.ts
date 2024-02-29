import { AddAdmin } from '@/presentation/dtos/admin/add-admin';
import { AdminModel } from '../models/admin';
import { IDbAddAdminRepository } from '../protocols/db/admin/add-admin-repository';
import { IDbDeleteAdminRepository } from '../protocols/db/admin/delete-admin-respository';
import { IDbFindAdminByEmailRepository } from '../protocols/db/admin/find-admin-by-email-repository';
import { IDbFindAdminByIdRepository } from '../protocols/db/admin/find-admin-by-id-repository';
import { IDbListAdminRepository } from '../protocols/db/admin/list-admin-respository';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AdminRepository
  implements
    IDbAddAdminRepository,
    IDbFindAdminByEmailRepository,
    IDbListAdminRepository,
    IDbFindAdminByIdRepository,
    IDbDeleteAdminRepository
{
  abstract delete(id: string): Promise<AdminModel>;
  abstract findById(id: string): Promise<AdminModel>;
  abstract getAll(): Promise<AdminModel[]>;
  abstract findByEmail(email: string): Promise<AdminModel>;
  abstract create(payload: AddAdmin): Promise<AdminModel>;
}
