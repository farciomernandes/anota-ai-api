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
import { IDbAddAdminRepository } from '@/core/domain/protocols/db/admin/add-admin-repository';
import { IDbListAdminRepository } from '@/core/domain/protocols/db/admin/list-admin-respository';
import { AddAdmin } from '@/presentation/dtos/admin/add-admin';
import { AdminModel } from '@/core/domain/models/admin';

@ApiTags('Admin')
@Controller('api/v1/admin')
export class AdminController {
  constructor(
    private readonly dbAddAdmin: IDbAddAdminRepository,
    private readonly dbListAdmin: IDbListAdminRepository,
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
  async getAll(): Promise<AdminModel[]> {
    try {
      return await this.dbListAdmin.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
