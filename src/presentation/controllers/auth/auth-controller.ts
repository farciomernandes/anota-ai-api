import { IAuthUser } from '@/core/domain/protocols/auth/auth-user';
import {
  AuthenticatedUserDto,
  LoginUserDto,
} from '@/presentation/dtos/user/login-user.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authAuth: IAuthUser) {}

  @ApiBody({
    type: LoginUserDto,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: AuthenticatedUserDto,
  })
  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() payload: any): Promise<any> {
    return await this.authAuth.auth(payload.email, payload.password);
  }
}
