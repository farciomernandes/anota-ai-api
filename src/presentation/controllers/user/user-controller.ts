import { IDbAddUserRepository } from '@/core/domain/protocols/db/user/add-user-repository';
import { IDbListUserRepository } from '@/core/domain/protocols/db/user/list-category-respository';
import { UserModel } from '@/core/domain/models/user';
import { Roles } from '@/shared/decorators/roles.decorator';
import { RolesGuard } from '@/infra/guards/roles.guard';
import { AddUserModel } from '@/presentation/dtos/user/add-user.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
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
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async getAll(): Promise<UserModel[]> {
    try {
      return await this.dbListUser.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
