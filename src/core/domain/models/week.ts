import { DaysEnum } from '@/shared/enums/days.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WeekModel {
  @ApiProperty({
    type: String,
    example: DaysEnum.MONDAY,
  })
  @Expose()
  short_name: string;

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
}
