export abstract class IAuthAdmin {
  abstract auth(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; name: string }>;
}
