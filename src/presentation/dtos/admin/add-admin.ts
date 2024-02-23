import { RolesEnum } from '@/shared/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddAdmin {
  @ApiProperty({
    type: String,
    example: 'any@mail.com',
  })
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    example: 'password',
    description: 'Senha utilizada para fazer login no sistema',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    example: RolesEnum.ADMIN,
  })
  @Expose()
  @IsNotEmpty()
  roleId: string;

  static toDto(payload: AddAdmin): AddAdmin {
    return plainToInstance(AddAdmin, payload, {
      excludeExtraneousValues: true,
    });
  }
}
