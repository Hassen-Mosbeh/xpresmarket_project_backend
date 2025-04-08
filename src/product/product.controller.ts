import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  Patch,
} from '@nestjs/common';
import { Product } from './product.model';
import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { product } from '@prisma/client';

@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProduct(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.productService.getAllProduct();
    return response.status(200).json({
      status: 'Ok!',
      message: 'Successfully fetch data!',
      result: result,
    });
  }

  @Post()
  async postProduct(@Body() postData: product): Promise<product> {
    return this.productService.createProduct(postData);
  }

  @Get(':product_id')
  async getProduct(
    @Param('product_id') product_id: number,
  ): Promise<Product | null> {
    return this.productService.getProduct(product_id);
  }

  @Delete(':product_id')
  async deleteProduct(
    @Param('product_id') product_id: number,
  ): Promise<Product> {
    return this.productService.deleteProduct(product_id);
  }

  // @Put(':product_id')
  // async updateProduct(
  //   @Param('product_id') product_id: number,
  //   @Body() data: Product,
  // ): Promise<Product> {
  //   return this.productService.updateProduct(product_id, data);
  // }

  @Patch(':product_id')
  async updateProductPatch(
    @Param('product_id') product_id: number,
    @Body() data: Partial<Product>
  ){
    return this.productService.updateProduct(product_id, data);
  }
}
