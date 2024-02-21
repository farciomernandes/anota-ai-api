import { JwtAdapter } from '@/infra/adapters/jwt-adapter';
import { ConfigService } from '@nestjs/config';

jest.mock('@nestjs/config');

describe('JwtAdapter', () => {
  let jwtAdapter: JwtAdapter;

  beforeEach(() => {
    const configServiceMock = new ConfigService();
    jest.spyOn(configServiceMock, 'get').mockReturnValue('any-secret-key');

    jwtAdapter = new JwtAdapter(configServiceMock);
  });

  it('Should encrypt payload and return a valid JWT', async () => {
    const payload = { userId: 123, username: 'any_user' };
    const encryptedToken = await jwtAdapter.encrypt(payload);
    const decodedPayload = await jwtAdapter.decrypt(encryptedToken);

    expect(typeof encryptedToken).toBe('string');
    expect(decodedPayload).toEqual({ ...payload, iat: expect.any(Number) });
  });

  it('Should decrypt a valid JWT and return the original payload', async () => {
    const payload = { userId: 123, username: 'any_user' };
    const token = await jwtAdapter.encrypt(payload);
    const decryptedPayload = await jwtAdapter.decrypt(token);

    expect(typeof token).toBe('string');
    expect(decryptedPayload).toEqual({ ...payload, iat: expect.any(Number) });
  });

  it('Should throw an error for an invalid JWT', async () => {
    const invalidToken = 'invalid-token';

    await expect(jwtAdapter.decrypt(invalidToken)).rejects.toThrow();
  });
});
