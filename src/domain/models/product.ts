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
    example: '65bb7e942d26288721fdbb32',
  })
  @IsNotEmpty()
  @Expose()
  ownerId: string;

  @ApiProperty({
    type: String,
    example: '65bb7e942d26288721fdbb32',
  })
  @IsNotEmpty()
  @Expose()
  categoryId: string;

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
