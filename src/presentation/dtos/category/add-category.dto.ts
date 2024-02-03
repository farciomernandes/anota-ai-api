import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AddCategoryModel {
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
    type: String,
    example: '65bd52691a0f4c3b57819a4b',
  })
  @IsNotEmpty()
  @Expose()
  ownerId: string;

  static toDto(payload: AddCategoryModel): AddCategoryModel {
    return plainToInstance(AddCategoryModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
