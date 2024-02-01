import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateCategoryModel {
  @ApiProperty({
    type: String,
    example: 'Nome',
  })
  @IsOptional()
  @Expose()
  title: string;

  @ApiProperty({
    type: String,
    example: 'Descrição da categoria',
  })
  @IsOptional()
  @Expose()
  description: string;

  static toDto(payload: UpdateCategoryModel): UpdateCategoryModel {
    return plainToInstance(UpdateCategoryModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
