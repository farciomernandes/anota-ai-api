import { UserModel } from '@/domain/models/user';

export abstract class IDbFindUserByEmailRepository {
  abstract findByEmail(email: string): Promise<UserModel>;
}
