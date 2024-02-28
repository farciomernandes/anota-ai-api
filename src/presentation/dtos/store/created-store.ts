import { PaymentModel } from '@/core/domain/models/payment';
import { RoleModel } from '@/core/domain/models/role';
import { WeekModel } from '@/core/domain/models/week';
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
    example: 'Bairro Saboroso',
  })
  @Expose()
  neighborhood: string;

  @ApiProperty({
    type: String,
    example: 'Rua das Pizzas',
  })
  @Expose()
  street: string;

  @ApiProperty({
    type: Number,
    example: 352,
  })
  @Expose()
  number: number;

  @ApiProperty({
    type: String,
    example: 'Aurora',
  })
  @Expose()
  city: string;

  @ApiProperty({
    type: String,
    example: 'CE',
  })
  @Expose()
  state: string;

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

  @ApiProperty({
    type: WeekModel,
    example: WeekModel,
    isArray: true,
  })
  @Expose()
  week: WeekModel[];

  @ApiProperty({
    type: PaymentModel,
    example: PaymentModel,
  })
  @Expose()
  payment_method: PaymentModel;

  static toDto(payload: CreatedStore): CreatedStore {
    return plainToInstance(CreatedStore, payload, {
      excludeExtraneousValues: true,
    });
  }
}
