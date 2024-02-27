import { RoleModel } from '@/core/domain/models/role';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
export class CreatedStore {
  @ApiProperty({
    type: String,
    example: '65bd52691a0f4c3b57819a4b',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    example: 'any@mail.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    example: 'Pizza House',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Rua das Pizzas, Bairro Saboroso, N 12',
  })
  @Expose()
  address: string;

  @ApiProperty({
    type: String,
    example: '12345-678',
  })
  @Expose()
  cep: string;

  @ApiProperty({
    type: String,
    example: '(11) 9876-5432',
  })
  @Expose()
  phone: string;

  @ApiPropertyOptional({
    type: String,
    example: 'https://example.com/profile.jpg',
  })
  @Expose()
  file?: string;

  @ApiProperty({
    type: String,
    example: 'password',
    description: 'Senha utilizada para fazer login no sistema',
  })
  password: string;

  @ApiProperty({
    type: RoleModel,
    example: RoleModel,
  })
  @Expose()
  role: RoleModel;

  static toDto(payload: CreatedStore): CreatedStore {
    return plainToInstance(CreatedStore, payload, {
      excludeExtraneousValues: true,
    });
  }
}
