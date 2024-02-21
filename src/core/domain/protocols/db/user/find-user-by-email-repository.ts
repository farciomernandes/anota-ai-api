import { UserModel } from '@/core/domain/models/user';

export abstract class IDbFindUserByEmailRepository {
  abstract findByEmail(email: string): Promise<UserModel>;
}
