import { Encrypter } from '@/core/domain/protocols/cryptography/encrypter';
import { HashComparer } from '@/core/domain/protocols/cryptography/hash-compare';
import { AdminMongoRepository } from '@/infra/db/mongodb/admin/admin-mongo-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthAdmin {
  constructor(
    private readonly adminRepository: AdminMongoRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async auth(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; name: string }> {
    const admin = await this.adminRepository.findByEmail(email);

    /**
     * 2 dominios diferentes ( 2 auth )
     * 2 regras de dominio diferentes
     */

    if (admin) {
      const isValid = await this.hashComparer.compare(password, admin.password);
      if (isValid) {
        const accessToken = await this.encrypter.encrypt({
          id: admin.id,
          roles: admin.role,
        });
        return {
          accessToken,
          name: admin.name,
        };
      }
    }
    throw new BadRequestException(`Admin with ${email} not found!`);
  }
}
