import { UserModel } from '@/core/domain/models/user';

export abstract class IDbListUserRepository {
  abstract getAll(): Promise<UserModel[]>;
}
