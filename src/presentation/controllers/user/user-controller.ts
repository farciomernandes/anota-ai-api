import { IDbAddUserRepository } from '@/data/protocols/db/user/add-user-repository';
import { UserModel } from '@/domain/models/user';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly dbAddUser: IDbAddUserRepository) {}

  @ApiBody({
    description: 'Create user',
    type: AddUserModel,
  })
  @ApiCreatedResponse({ type: UserModel })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: AddUserModel): Promise<UserModel> {
    return await this.dbAddUser.create(payload);
  }
}
