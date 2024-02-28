import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaymentModel {
  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  creditcard: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Expose()
  money: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Expose()
  pix: boolean;
}
