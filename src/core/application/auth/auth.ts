import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUser {
  constructor(
    private readonly userRepository: UserMongoRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async auth(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; name: string }> {
    const user = await this.userRepository.findByEmail(email);

    /**
     * 2 dominios diferentes ( 2 auth )
     * 2 regras de dominio diferentes
     */

    if (user) {
      const isValid = await this.hashComparer.compare(password, user.password);
      if (isValid) {
        const accessToken = await this.encrypter.encrypt({
          id: user.id,
          roles: [RolesEnum.ADMIN],
        });
        return {
          accessToken,
          name: user.name,
        };
      }
    }
    return null;
  }
}
