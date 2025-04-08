import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  // InternalServerErrorException,
  // NotFoundException,
  Req,
  Res,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { category } from '@prisma/client';
import { Request, Response } from 'express';

@Controller('api/v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategory(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.categoryService.getAllCategories();
    return response.status(200).json({
      status: 'Ok!',
      message: 'Successfully fetched data!',
      result: result,
    });
  }

  @Post()
  async createCategory(@Body() postData: category): Promise<category> {
    return this.categoryService.createCategory(postData);
  }

  @Get(':category_id')
  async getCategory(@Param('category_id') category_id: number): Promise<category | null> {
    return this.categoryService.getCategory(Number(category_id));
  }

  // @Get(':category_name')
  // async getCategoryName(@Param('category_name') category_name: string): Promise<category | null> {
  //   console.log(`Received request for category: ${category_name}`); // Debugging line
  //   try {
  //     const category = await this.categoryService.getCategoryName(category_name);
  //     if (!category) {
  //       throw new NotFoundException(`Category with name ${category_name} not found.`);
  //     }
  //     return category;
  //   } catch (error) {
  //     console.error('Error in controller:', error); // Debugging line
  //     throw new InternalServerErrorException('An error occurred while fetching the category.');
  //   }
  // }

  @Delete(':category_id')
  async deleteCategory(@Param('category_id') category_id: number): Promise<category> {
    return this.categoryService.deleteCategory(Number(category_id));
  }

  // @Put(':category_id')
  // async updateCategory(
  //   @Param('category_id') category_id: number,
  //   @Body() data: Partial<category>,
  // ): Promise<category> {
  //   return this.categoryService.updateCategory(Number(category_id), data);
  // }

  @Patch(':category_id') // New PATCH route
    async updateProductPatch(
      @Param('category_id') category_id: number,
      @Body() data: category,
    ): Promise<category> {
      return this.categoryService.updateCategory(category_id, data);
    }
}
