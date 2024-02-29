import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsString,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { DaysEnum } from '@/shared/enums/days.enum';

export class AddWeekDto {
  @ApiProperty({
    type: String,
    example: DaysEnum.MONDAY,
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn([
    DaysEnum.MONDAY,
    DaysEnum.TUESDAY,
    DaysEnum.WEDNESDAY,
    DaysEnum.THURSDAY,
    DaysEnum.FRIDAY,
    DaysEnum.SATURDAY,
    DaysEnum.SUNDAY,
  ])
  day: string;

  @ApiProperty({
    type: String,
    example: '17:00',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({
    type: String,
    example: '23:00',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  end: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @Expose()
  @IsBoolean()
  opened: boolean;

  @ApiProperty({
    type: String,
    example: '65bb7e942d26288721fdbb32',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  ownerId: string;
}
