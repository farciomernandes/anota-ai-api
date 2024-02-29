export abstract class IDbFindByTitleProductRepository {
  abstract findByTitle(title: string): Promise<boolean>;
}
