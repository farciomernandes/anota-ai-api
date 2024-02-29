import { DaysEnum } from '@/shared/enums/days.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WeekModel {
  @ApiProperty({
    type: String,
    example: DaysEnum.MONDAY,
  })
  @Expose()
  day: string;

  @ApiProperty({
    type: String,
    example: '17:00',
  })
  @Expose()
  start: string;

  @ApiProperty({
    type: String,
    example: '23:00',
  })
  @Expose()
  end: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Expose()
  opened: boolean;

  @ApiProperty({
    type: String,
    example: '65bb7e942d26288721fdbb32',
  })
  @Expose()
  ownerId: string;
}
