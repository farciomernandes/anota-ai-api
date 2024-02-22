import { ApiProperty } from '@nestjs/swagger';

export class Authenticated {
  @ApiProperty({
    type: String,
    example: '65bd52691a0f4c3b57819a4b',
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    example: ['STORE', 'ADMIN'],
    isArray: true,
  })
  roles: string[];
}
