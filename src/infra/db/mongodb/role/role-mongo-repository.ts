import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MongoHelper } from '../helpers/mongo-helper';
import { RoleModel } from '@/core/domain/models/role';
import { RoleRepository } from '@/core/domain/repositories/role-repository';

@Injectable()
export class RoleMongoRepository implements RoleRepository {
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
