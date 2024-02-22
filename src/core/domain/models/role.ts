import { RolesEnum } from '@/shared/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

export class RoleModel {
  @ApiProperty({
    type: String,
    example: '65bd52691a0f4c3b57819a4b',
    required: false,
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    example: RolesEnum.ADMIN,
    required: true,
  })
  @Expose()
  value: string;

  @ApiProperty({
    type: String,
    example: 'Role de acesso geral a todas as funcionalidades do sistema.',
    required: true,
  })
  @Expose()
  label: string;

  static toDto(payload: RoleModel): RoleModel {
    return plainToInstance(RoleModel, payload, {
      excludeExtraneousValues: true,
    });
  }
}
