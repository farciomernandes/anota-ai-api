import { UpdateProductModel } from '@/presentation/dtos/product/update-product.dto';
import { ProductModel } from '@/core/domain/models/product';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';

export abstract class IDbUpdateProductRepository {
  abstract update(
    id: string,
    payload: UpdateProductModel,
    user: Authenticated,
  ): Promise<ProductModel>;
}
