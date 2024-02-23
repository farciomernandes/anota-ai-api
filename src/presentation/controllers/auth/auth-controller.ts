import { IAuthAdmin } from '@/core/domain/protocols/auth/auth-admin';
import { IAuthStore } from '@/core/domain/protocols/auth/auth-store';
import {
  AuthenticatedAdminDto,
  LoginAdminDto,
} from '@/presentation/dtos/admin/login-store.dto';
import {
  AuthenticatedStoreDto,
  LoginStoreDto,
} from '@/presentation/dtos/store/login-store.dto';

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authStore: IAuthStore,
    private readonly authAdmin: IAuthAdmin,
  ) {}

  @ApiBody({
    type: LoginStoreDto,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: AuthenticatedStoreDto,
  })
  @Post('store')
  @HttpCode(HttpStatus.CREATED)
  async loginStore(@Body() payload: any): Promise<any> {
    return await this.authStore.auth(payload.email, payload.password);
  }

  @ApiBody({
    type: LoginAdminDto,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: AuthenticatedAdminDto,
  })
  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  async loginAdmin(@Body() payload: any): Promise<any> {
    return await this.authAdmin.auth(payload.email, payload.password);
  }
}
