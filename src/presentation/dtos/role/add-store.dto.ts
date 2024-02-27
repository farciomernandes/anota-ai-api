import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

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
    example: 'Rua das Pizzas, Bairro Saboroso, N 12',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    type: String,
    example: '12345-678',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsPostalCode('BR')
  cep: string;

  @ApiProperty({
    type: String,
    example: '(11) 9876-5432',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string;

  @ApiPropertyOptional({
    type: String,
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsUrl()
  @Expose()
  profilePhoto?: string;

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
