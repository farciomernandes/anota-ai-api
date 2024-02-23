import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MongoHelper } from '../helpers/mongo-helper';
import { IDbAddAdminRepository } from '@/core/domain/protocols/db/admin/add-admin-repository';
import { AdminModel } from '@/core/domain/models/admin';
import { ObjectId } from 'mongodb';
import { IDbFindAdminByEmailRepository } from '@/core/domain/protocols/db/admin/find-admin-by-email-repository';
import { IDbListAdminRepository } from '@/core/domain/protocols/db/admin/list-admin-respository';
import { AddAdmin } from '@/presentation/dtos/admin/add-admin';

@Injectable()
export class AdminMongoRepository
  implements
    IDbAddAdminRepository,
    IDbFindAdminByEmailRepository,
    IDbListAdminRepository
{
  async create(payload: AddAdmin): Promise<AdminModel> {
    try {
      const adminCollection = await MongoHelper.getCollection('admins');
      const roleCollection = await MongoHelper.getCollection('roles');

      const role = await roleCollection.findOne({
        _id: new ObjectId(payload.roleId),
      });

      if (!role) {
        throw new NotFoundException(
          `Role with ${payload.roleId} id not found!`,
        );
      }

      delete payload.roleId;
      const result = await adminCollection.insertOne({
        ...payload,
        role: MongoHelper.map(role),
      });

      const admin = await adminCollection.findOne({
        _id: result.insertedId,
      });

      return MongoHelper.map({
        ...admin,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<AdminModel[]> {
    try {
      const adminCollection = await MongoHelper.getCollection('admins');

      const admins = await adminCollection.find().toArray();

      return admins.map((admin) => MongoHelper.map(admin));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByEmail(email: string): Promise<AdminModel> {
    try {
      const adminCollection = await MongoHelper.getCollection('admins');
      const admin = await adminCollection.findOne({
        email,
      });

      if (!admin) {
        return null;
      }

      return MongoHelper.map(admin);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
