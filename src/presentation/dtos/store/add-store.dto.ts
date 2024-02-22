import { RolesEnum } from '@/shared/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AddStoreModel {
  @ApiProperty({
    type: String,
    example: 'any@mail.com',
    required: true,
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    example: '65d771c9a1acf6d4b2aec923',
    required: true,
  })
  @IsNotEmpty()
  @Expose()
  roleId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'password',
    description: 'Senha utilizada para fazer login no sistema',
  })
  @IsString()
  @MinLength(8)
  password: string;

  static toDto(payload: AddStoreModel): AddStoreModel {
    return plainToInstance(AddStoreModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
