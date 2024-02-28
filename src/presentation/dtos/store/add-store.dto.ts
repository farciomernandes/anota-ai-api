import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
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
    example: 'Bairro Saboroso',
  })
  @Expose()
  neighborhood: string;

  @ApiProperty({
    type: String,
    example: 'Rua das Pizzas',
  })
  @Expose()
  street: string;

  @ApiProperty({
    type: Number,
    example: 352,
  })
  @Expose()
  number: number;

  @ApiProperty({
    type: String,
    example: 'Aurora',
  })
  @Expose()
  city: string;

  @ApiProperty({
    type: String,
    example: 'CE',
  })
  @Expose()
  state: string;

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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file',
  })
  @IsNotEmpty()
  file?: any;

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
