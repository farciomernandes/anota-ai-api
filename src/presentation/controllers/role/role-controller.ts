import { Roles } from '@/shared/decorators/roles.decorator';
import { RolesGuard } from '@/infra/guards/roles.guard';
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
import { IDbAddRoleRepository } from '@/core/domain/protocols/db/role/add-role-repository';
import { IDbListRoleRepository } from '@/core/domain/protocols/db/role/list-role-respository';
import { RoleModel } from '@/core/domain/models/role';

@ApiTags('Role')
@Controller('api/v1/role')
export class RoleController {
  constructor(
    private readonly dbAddRole: IDbAddRoleRepository,
    private readonly dbListRole: IDbListRoleRepository,
  ) {}

  @ApiBody({
    description: 'Create Role',
    type: RoleModel,
  })
  @ApiCreatedResponse({ type: RoleModel })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: Omit<RoleModel, 'id'>): Promise<RoleModel> {
    return await this.dbAddRole.create(payload);
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns Roles.',
    status: HttpStatus.OK,
    type: RoleModel,
  })
  @UseGuards(RolesGuard)
  async getAll(): Promise<RoleModel[]> {
    try {
      return await this.dbListRole.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
