import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { CategoryModel } from './category';
import { ProductModel } from './product';

export class UserModel {
  @ApiProperty({
    type: String,
    example: '65bd52691a0f4c3b57819a4b',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    example: 'any@mail.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    example: 'hashed_password',
    description: 'Senha utilizada para fazer login no sistema',
  })
  password: string;

  @ApiProperty({
    type: CategoryModel,
    example: CategoryModel,
    isArray: true,
  })
  @Expose()
  categories: CategoryModel[];

  @ApiProperty({
    type: ProductModel,
    isArray: true,
    example: ProductModel,
  })
  @Expose()
  products: ProductModel[];

  static toDto(payload: UserModel): UserModel {
    return plainToInstance(UserModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
