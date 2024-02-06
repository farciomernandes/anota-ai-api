import { ProductModel } from '@/domain/models/product';

export abstract class IDbDeleteProductRepository {
  abstract delete(id: string): Promise<ProductModel>;
}
