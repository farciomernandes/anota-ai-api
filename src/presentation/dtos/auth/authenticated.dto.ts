import { RoleModel } from '@/core/domain/models/role';
import { ApiProperty } from '@nestjs/swagger';

export class Authenticated {
  @ApiProperty({
    type: String,
    example: '65bd52691a0f4c3b57819a4b',
  })
  id: string;

  @ApiProperty({
    type: RoleModel,
    required: true,
    example: RoleModel,
  })
  roles: RoleModel;
}
