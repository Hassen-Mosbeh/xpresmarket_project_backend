import { Prisma } from '@prisma/client';
//import { Product } from "src/product/product.model";
export class category implements Prisma.categoryCreateInput {
  category_id: number;
  category_name: string;
  descp_category: string;
  //product : Product[] ;
}
