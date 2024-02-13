import { UserModel } from '@/domain/models/user';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';

export abstract class IDbAddUserRepository {
  abstract create(payload: AddUserModel): Promise<UserModel>;
}
