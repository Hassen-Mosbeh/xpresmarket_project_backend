import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { category } from "@prisma/client";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories(): Promise<category[]> {
    return this.prisma.category.findMany();
  }

  async getCategory(category_id: number): Promise<category | null> {
    return this.prisma.category.findUnique({ where: { category_id: Number(category_id) } });
  }

  // async getCategoryName(category_name: string): Promise<category | null> {
  //   console.log(`Fetching category with name: ${category_name}`); // Debugging line
  //   try {
  //     const category = await this.prisma.category.findFirst({
  //       where: { category_name: category_name },
  //     });
  //     console.log(`Found category:`, category); // Debugging line
  //     return category;
  //   } catch (error) {
  //     console.error('Error fetching category:', error); // Debugging line
  //     throw error;
  //   }
  // }

  async createCategory(data: category): Promise<category> {
    return this.prisma.category.create({ data });
  }

  async updateCategory(category_id: number, data: Partial<category>): Promise<category> {
    return this.prisma.category.update({
      where: { category_id: Number(category_id) },
      data
    });
  }

  async deleteCategory(category_id: number): Promise<category> {
    return this.prisma.category.delete({ where: { category_id: Number(category_id) } });
  }
}
