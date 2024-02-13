import { UserModel } from '@/domain/models/user';

export abstract class IDbListUserRepository {
  abstract getAll(): Promise<UserModel[]>;
}
