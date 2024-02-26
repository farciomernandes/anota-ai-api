import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDbAddAdminRepository } from '@/core/domain/protocols/db/admin/add-admin-repository';
import { IDbListAdminRepository } from '@/core/domain/protocols/db/admin/list-admin-respository';
import { AddAdmin } from '@/presentation/dtos/admin/add-admin';
import { AdminModel } from '@/core/domain/models/admin';
import { Roles } from '@/shared/decorators/roles.decorator';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { RolesGuard } from '@/infra/guards/roles.guard';
import { User } from '@/shared/decorators/user.decorator';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { IDbDeleteAdminRepository } from '@/core/domain/protocols/db/admin/delete-admin-respository';

@ApiTags('Admin')
@Controller('api/v1/admin')
export class AdminController {
  constructor(
    private readonly dbAddAdmin: IDbAddAdminRepository,
    private readonly dbListAdmin: IDbListAdminRepository,
    private readonly dbDeleteAdmin: IDbDeleteAdminRepository,
  ) {}

  @ApiBody({
    description: 'Create Admin',
    type: AddAdmin,
  })
  @ApiCreatedResponse({ type: AdminModel })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: AddAdmin): Promise<AdminModel> {
    return await this.dbAddAdmin.create(payload);
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns Admins.',
    status: HttpStatus.OK,
    type: AdminModel,
  })
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth()
  async getAll(): Promise<AdminModel[]> {
    try {
      return await this.dbListAdmin.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete('/:id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: AdminModel,
  })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async delete(
    @Param('id') id: string,
    @User() user: Authenticated,
  ): Promise<AdminModel> {
    try {
      const response = await this.dbDeleteAdmin.delete(id, user);

      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
