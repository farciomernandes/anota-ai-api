import { ProductModel } from '@/core/domain/models/product';

export abstract class IDbListProductRepository {
  abstract getAll(): Promise<ProductModel[]>;
}
