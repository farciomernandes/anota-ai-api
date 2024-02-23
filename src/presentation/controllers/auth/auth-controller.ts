import { IAuthStore } from '@/core/domain/protocols/auth/auth-store';
import {
  AuthenticatedStoreDto,
  LoginStoreDto,
} from '@/presentation/dtos/store/login-store.dto';

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authStore: IAuthStore) {}

  @ApiBody({
    type: LoginStoreDto,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: AuthenticatedStoreDto,
  })
  @Post('store')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() payload: any): Promise<any> {
    return await this.authStore.auth(payload.email, payload.password);
  }
}
