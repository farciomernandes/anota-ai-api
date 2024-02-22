export abstract class IAuthStore {
  abstract auth(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; name: string }>;
}
