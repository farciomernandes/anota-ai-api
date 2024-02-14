export abstract class IAuthUser {
  abstract auth(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; name: string }>;
}
