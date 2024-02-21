import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { ProductModel } from '@/core/domain/models/product';

export abstract class IDbUpdateProductRepository {
  abstract update(
    id: string,
    payload: UpdateProductModel,
  ): Promise<ProductModel>;
}
