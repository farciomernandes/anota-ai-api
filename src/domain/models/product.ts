import { CategoryModel } from './category';

export interface ProductModel {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  price: number;
  category: CategoryModel;
}
