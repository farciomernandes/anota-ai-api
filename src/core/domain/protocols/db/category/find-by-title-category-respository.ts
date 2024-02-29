export abstract class IDbFindByTitleCategoryRepository {
  abstract findByTitle(title: string): Promise<boolean>;
}
