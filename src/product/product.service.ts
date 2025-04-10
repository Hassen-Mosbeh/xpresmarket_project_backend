// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './productDto/product.dto'; // Import the DTO
import { product } from '@prisma/client';  // Import Prisma `product` type

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProduct(): Promise<product[]> {
    return this.prisma.product.findMany();
  }

  async getProduct(product_id: number): Promise<product | null> {
    return this.prisma.product.findUnique({
      where: { product_id: Number(product_id) },
    });
  }

  async createProduct(data: CreateProductDto, ownerId: number): Promise<product> {
    return this.prisma.product.create({
      data: {
        ...data,      // Directly spread the data from DTO into Prisma create
        ownerId,      // Assign the seller as the owner of the product
      },
    });
  }

  async updateProduct(
    product_id: number,
    data: Partial<product>,
  ): Promise<product> {
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

  async deleteProduct(product_id: number): Promise<product> {
    return this.prisma.product.delete({
      where: { product_id: Number(product_id) },
    });
  }
}
