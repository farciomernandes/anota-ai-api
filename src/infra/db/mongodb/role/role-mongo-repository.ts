import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MongoHelper } from '../helpers/mongo-helper';
import { IDbAddRoleRepository } from '@/core/domain/protocols/db/role/add-role-repository';
import { IDbListRoleRepository } from '@/core/domain/protocols/db/role/list-role-respository';
import { RoleModel } from '@/core/domain/models/role';
import { IDbFindRoleByEmailRepository } from '@/core/domain/protocols/db/role/find-role-by-value-repository';

@Injectable()
export class RoleMongoRepository
  implements
    IDbAddRoleRepository,
    IDbListRoleRepository,
    IDbFindRoleByEmailRepository
{
  async create(payload: Omit<RoleModel, 'id'>): Promise<RoleModel> {
    try {
      const roleCollection = await MongoHelper.getCollection('roles');

      const result = await roleCollection.insertOne(payload);

      const role = await roleCollection.findOne({
        _id: result.insertedId,
      });

      return MongoHelper.map({
        ...role,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<RoleModel[]> {
    try {
      const roleCollection = await MongoHelper.getCollection('roles');

      const rolesCursor = await roleCollection.find();
      const roles = await rolesCursor.toArray();

      return roles.map((role) => MongoHelper.map(role));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByValue(value: string): Promise<RoleModel> {
    try {
      const roleCollection = await MongoHelper.getCollection('roles');
      const role = await roleCollection.findOne({
        value,
      });

      if (!role) {
        return null;
      }

      return MongoHelper.map(role);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
