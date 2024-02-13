import { IHasher } from '@/data/protocols/cryptography/hasher';
import * as bcrypt from 'bcrypt';

export class BcryptAdapter implements IHasher {
  private readonly salt: number = 12;

  async hash(text: string): Promise<string> {
    const hash = await bcrypt.hash(text, this.salt);
    return hash;
  }
}
