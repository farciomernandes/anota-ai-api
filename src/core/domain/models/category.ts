import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CategoryModel {
  @ApiProperty({
    type: String,
    example: '65bd52691a0f4c3b57819a4b',
  })
  @IsNotEmpty()
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    example: 'title',
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
    type: String,
    example: '65bd52691a0f4c3b57819a4b',
  })
  @IsNotEmpty()
  @Expose()
  ownerId: string;

  static toDto(payload: CategoryModel): CategoryModel {
    return plainToInstance(CategoryModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
