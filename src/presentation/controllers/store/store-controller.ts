import { StoreModel } from '@/core/domain/models/store';
import { Roles } from '@/shared/decorators/roles.decorator';
import { RolesGuard } from '@/infra/guards/roles.guard';
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
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDbAddStoreRepository } from '@/core/domain/protocols/db/store/add-store-repository';
import { IDbListStoreRepository } from '@/core/domain/protocols/db/store/list-store-respository';
import { CreatedStore } from '@/presentation/dtos/store/created-store';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { User } from '@/shared/decorators/user.decorator';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { IDbDeleteStoreRepository } from '@/core/domain/protocols/db/store/delete-store-respository';
import { IDbUpdateStoreRepository } from '@/core/domain/protocols/db/store/update-store-respository';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from '@/infra/config/multer';

@ApiTags('Store')
@Controller('api/v1/store')
export class StoreController {
  constructor(
    private readonly dbAddStore: IDbAddStoreRepository,
    private readonly dbListStore: IDbListStoreRepository,
    private readonly dbDeleteStore: IDbDeleteStoreRepository,
    private readonly dbUpdateStore: IDbUpdateStoreRepository,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiCreatedResponse({ type: CreatedStore })
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiBody({
    description: 'Create Store',
    type: AddStoreModel,
  })
  async create(
    @Body() payload: Omit<AddStoreModel, 'file'>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreatedStore> {
    return await this.dbAddStore.create(payload, file);
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns Stores.',
    status: HttpStatus.OK,
    type: StoreModel,
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  async getAll(): Promise<StoreModel[]> {
    try {
      return await this.dbListStore.getAll();
    } catch (error) {
      console.log('saca');

      throw new HttpException(error.response, error.status);
    }
  }

  @Put('/:id')
  @ApiBody({
    type: AddStoreModel,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: StoreModel,
  })
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() payload: Omit<AddStoreModel, 'ownerId'>,
    @User() user: Authenticated,
  ): Promise<StoreModel> {
    try {
      return await this.dbUpdateStore.update(id, payload, user);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Delete('/:id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: StoreModel,
  })
  @Roles(RolesEnum.ADMIN, RolesEnum.STORE)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async delete(
    @Param('id') id: string,
    @User() user: Authenticated,
  ): Promise<StoreModel> {
    try {
      const response = await this.dbDeleteStore.delete(id, user);

      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
