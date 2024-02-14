import { IAuthUser } from '@/data/protocols/auth/auth-user';
import { IDbAddUserRepository } from '@/data/protocols/db/user/add-user-repository';
import { IDbListUserRepository } from '@/data/protocols/db/user/list-category-respository';
import { UserModel } from '@/domain/models/user';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';
import {
  AuthenticatedUserDto,
  LoginUserDto,
} from '@/presentation/dtos/user/login-user.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('api/v1/user')
export class UserController {
  constructor(
    private readonly dbAddUser: IDbAddUserRepository,
    private readonly dbListUser: IDbListUserRepository,
    private readonly authUser: IAuthUser,
  ) {}

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

  @Get()
  @ApiOkResponse({
    description: 'Returns users.',
    status: HttpStatus.OK,
    type: UserModel,
  })
  async getAll(): Promise<UserModel[]> {
    try {
      return await this.dbListUser.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @ApiBody({
    type: LoginUserDto,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: AuthenticatedUserDto,
  })
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() payload: any): Promise<any> {
    return await this.authUser.auth(payload.email, payload.password);
  }
}
