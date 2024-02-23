import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthStore {
  constructor(
    private readonly storeRepository: StoreMongoRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async auth(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; name: string }> {
    const store = await this.storeRepository.findByEmail(email);

    /**
     * 2 dominios diferentes ( 2 auth )
     * 2 regras de dominio diferentes
     */

    if (store) {
      const isValid = await this.hashComparer.compare(password, store.password);
      if (isValid) {
        const accessToken = await this.encrypter.encrypt({
          id: store.id,
          roles: [RolesEnum.ADMIN],
        });
        return {
          accessToken,
          name: store.name,
        };
      }
    }
    throw new BadRequestException(`Store with ${email} not found!`);
  }
}
