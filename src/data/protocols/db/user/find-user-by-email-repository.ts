export abstract class IDbFindUserByEmailRepository {
  abstract findByEmail(email: string): Promise<boolean>;
}
