import { product } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Product } from './product.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProduct(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async getProduct(product_id: number): Promise<Product | null> {
      return this.prisma.product.findUnique({ where: { product_id: Number(product_id) } });
    }

  async createProduct(data: product): Promise<product> {
    return this.prisma.product.create({ data });
  }

  async updateProduct(product_id: number, data: Partial<Product>): Promise<Product> {
    return this.prisma.product.update({
      where: { product_id: Number(product_id) },
      data: { 
        product_name: data.product_name,
        description: data.description ?? null,
        price: data.price,
        stock: data.stock,
        status: data.status ?? true,
        image: data.image ?? null,
        category_id: data.category_id ?? null,
      },
    });
  }

  async deleteProduct(product_id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { product_id: Number(product_id) },
    });
  }
}
