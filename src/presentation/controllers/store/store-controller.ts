import { StoreModel } from '@/core/domain/models/store';
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
import { IDbAddStoreRepository } from '@/core/domain/protocols/db/store/add-store-repository';
import { IDbListStoreRepository } from '@/core/domain/protocols/db/store/list-store-respository';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';

@ApiTags('Store')
@Controller('api/v1/store')
export class StoreController {
  constructor(
    private readonly dbAddStore: IDbAddStoreRepository,
    private readonly dbListStore: IDbListStoreRepository,
  ) {}

  @ApiBody({
    description: 'Create Store',
    type: AddStoreModel,
  })
  @ApiCreatedResponse({ type: StoreModel })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: AddStoreModel): Promise<StoreModel> {
    return await this.dbAddStore.create(payload);
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns Stores.',
    status: HttpStatus.OK,
    type: StoreModel,
  })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async getAll(): Promise<StoreModel[]> {
    try {
      return await this.dbListStore.getAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
