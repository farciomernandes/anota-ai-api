import { ProductModel } from '../../../../domain/models/product';
import { AddProductModel } from '../../../../presentation/dtos/product/add-product.dto';

export abstract class IDbAddProductRepository {
  abstract create(payload: AddProductModel): Promise<ProductModel>;
}
