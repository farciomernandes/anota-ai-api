import { ProductModel } from '@/core/domain/models/product';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';

export abstract class IDbDeleteProductRepository {
  abstract delete(id: string, user: Authenticated): Promise<ProductModel>;
}
