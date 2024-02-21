import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra/adapters/bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('BcryptAdapter', () => {
  let bcryptAdapter: BcryptAdapter;

  beforeEach(async () => {
    const configServiceMock = new ConfigService();
    jest.spyOn(configServiceMock, 'get').mockReturnValue(10);

    bcryptAdapter = new BcryptAdapter(configServiceMock);
  });

  describe('hash', () => {
    test('Should call bcrypt.hash with the correct parameters', async () => {
      const textToHash = 'any_text';
      await bcryptAdapter.hash(textToHash);

      expect(bcrypt.hash).toHaveBeenCalledWith(textToHash, 10);
    });

    test('Should return the hashed value', async () => {
      const hashedValue = 'hashed_value';
      (bcrypt.hash as jest.Mock).mockImplementationOnce(
        async () => hashedValue,
      );

      const result = await bcryptAdapter.hash('any_text');

      expect(result).toBe(hashedValue);
    });
  });

  describe('compare', () => {
    test('Should call bcrypt.compare with the correct parameters', async () => {
      const valueToCompare = 'any_value';
      const hashToCompare = 'any_hash';
      await bcryptAdapter.compare(valueToCompare, hashToCompare);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        valueToCompare,
        hashToCompare,
      );
    });

    test('Should return true if bcrypt.compare returns true', async () => {
      (bcrypt.compare as jest.Mock).mockImplementationOnce(async () => true);

      const result = await bcryptAdapter.compare('any_value', 'valid_hash');

      expect(result).toBe(true);
    });

    test('Should return false if bcrypt.compare returns false', async () => {
      (bcrypt.compare as jest.Mock).mockImplementationOnce(async () => false);

      const result = await bcryptAdapter.compare('any_value', 'invalid_hash');

      expect(result).toBe(false);
    });
  });
});
