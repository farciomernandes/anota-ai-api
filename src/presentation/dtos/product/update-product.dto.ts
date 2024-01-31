import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

export class UpdateProductModel {
  @ApiProperty({
    type: String,
    example: 'Nome',
  })
  @Expose()
  title: string;

  @ApiProperty({
    type: String,
    example: 'Descrição da categoria',
  })
  @Expose()
  description: string;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  @Expose()
  price: number;

  static toDto(payload: UpdateProductModel): UpdateProductModel {
    return plainToInstance(UpdateProductModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
