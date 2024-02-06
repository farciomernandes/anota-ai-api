import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { ProductModel } from '@/domain/models/product';

export abstract class IDbUpdateProductRepository {
  abstract update(
    id: string,
    payload: UpdateProductModel,
  ): Promise<ProductModel>;
}
