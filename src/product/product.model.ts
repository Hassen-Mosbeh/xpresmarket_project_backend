import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class Product implements Prisma.productCreateInput {
  product_id: number;
  product_name: string;
  description: string | null;
  price: Decimal;
  stock: number;
  status: boolean | null;
  image: string | null;
  category_id: number | null;
}
