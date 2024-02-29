import { ProductModel } from '@/core/domain/models/product';

export abstract class IDbFindByIdProductRepository {
  abstract findById(id: string): Promise<ProductModel>;
}
