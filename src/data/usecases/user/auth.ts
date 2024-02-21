import { Encrypter } from '@/data/protocols/cryptography/encrypter';
import { HashComparer } from '@/data/protocols/cryptography/hash-compare';
import { UserMongoRepository } from '@/infra/db/mongodb/user/user-mongo-repository';
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
    if (user) {
      const isValid = await this.hashComparer.compare(password, user.password);

      if (isValid) {
        const accessToken = await this.encrypter.encrypt({
          id: user.id,
          roles: ['ADMIN'],
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
