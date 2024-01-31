import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { CategoryModel } from './category';
export class ProductModel {
  @ApiProperty({
    type: String,
    example: 'dhjgn6ç52l',
  })
  @IsNotEmpty()
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    example: 'Nome',
  })
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiProperty({
    type: String,
    example: 'Descrição da categoria',
  })
  @IsNotEmpty()
  @Expose()
  description: string;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  @IsNotEmpty()
  @Expose()
  price: number;

  @ApiProperty({
    type: String,
    example: 'asG-1gmlç2em0-mdasjd',
  })
  @IsNotEmpty()
  @Expose()
  ownerId: string;

  @ApiProperty({
    type: CategoryModel,
    example: CategoryModel,
  })
  @IsNotEmpty()
  @Expose()
  category: CategoryModel;

  static toDto(payload: ProductModel): ProductModel {
    return plainToInstance(ProductModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
