import { ProductModel } from '@/core/domain/models/product';

export abstract class IDbFindByOwnerIdProductRepository {
  abstract findByOwnerId(id: string): Promise<ProductModel[]>;
}
