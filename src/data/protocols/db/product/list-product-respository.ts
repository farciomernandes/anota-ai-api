import { ProductModel } from '@/domain/models/product';

export abstract class IDbListProductRepository {
  abstract getAll(): Promise<ProductModel[]>;
}
