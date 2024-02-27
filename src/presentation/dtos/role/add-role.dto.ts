import { RolesEnum } from '@/shared/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';

export class AddRole {
  @ApiProperty({
    type: String,
    example: RolesEnum.ADMIN,
    required: true,
  })
  @IsString()
  @Expose()
  value: string;

  @ApiProperty({
    type: String,
    example: 'Role de acesso geral a todas as funcionalidades do sistema.',
    required: true,
  })
  @Expose()
  @IsString()
  label: string;

  static toDto(payload: AddRole): AddRole {
    return plainToInstance(AddRole, payload, {
      excludeExtraneousValues: true,
    });
  }
}
