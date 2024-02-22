import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { CategoryModel } from './category';
import { ProductModel } from './product';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { RoleModel } from './role';

export class StoreModel {
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
    example: 'Pizza House',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    example: 'password',
    description: 'Senha utilizada para fazer login no sistema',
  })
  password: string;

  @ApiProperty({
    type: RoleModel,
    example: RoleModel,
  })
  @Expose()
  role: RoleModel;

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

  static toDto(payload: StoreModel): StoreModel {
    return plainToInstance(StoreModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
