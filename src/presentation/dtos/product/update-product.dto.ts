import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CategoryModel } from '@/domain/models/category';

export class UpdateProductModel {
  @ApiProperty({
    type: String,
    example: 'Nome',
  })
  @Expose()
  @IsOptional()
  title?: string;

  @ApiProperty({
    type: String,
    example: 'Descrição da categoria',
  })
  @Expose()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  @Expose()
  @IsOptional()
  price?: number;

  @ApiProperty({
    type: String,
    example: 'Descrição da categoria',
  })
  @IsOptional()
  @Expose()
  categoryId?: string;

  category?: CategoryModel;

  static toDto(payload: UpdateProductModel): UpdateProductModel {
    return plainToInstance(UpdateProductModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
