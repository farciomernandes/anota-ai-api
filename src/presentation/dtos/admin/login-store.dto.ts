import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    type: String,
    example: 'any@mail.com',
    description: 'Email utilizado para fazer login no sistema',
    required: true,
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'password',
    description: 'Senha utilizada para fazer login no sistema',
  })
  @IsString()
  @MinLength(8)
  password: string;
}

export class AuthenticatedAdminDto {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI',
    description: 'Token de acesso para a api.',
    required: true,
  })
  @IsEmail()
  @Expose()
  accessToken: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'John Doe',
    description: 'Nome do usuário logado.',
  })
  @IsString()
  name: string;
}
