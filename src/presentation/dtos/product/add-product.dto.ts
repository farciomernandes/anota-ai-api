import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { CategoryModel } from '../../../domain/models/category';

export class AddProductModel {
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
    example: 'asG-1gmlç2em0-mdasjd',
  })
  @IsNotEmpty()
  @Expose()
  categoryId: string;

  static toDto(payload: AddProductModel): AddProductModel {
    return plainToInstance(AddProductModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
