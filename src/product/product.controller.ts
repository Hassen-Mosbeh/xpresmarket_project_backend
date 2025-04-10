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
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { product } from '@prisma/client';
import { CreateProductDto } from './productDto/product.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

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
  @UseGuards(JwtGuard)
  @Post()
  async postProduct(
    @Body() productDto: CreateProductDto,
    @Req() req,
  ): Promise<product> {
    const sellerId = req.user.id; //
    return this.productService.createProduct(productDto, sellerId);
  }

  @Get(':product_id')
  async getProduct(
    @Param('product_id') product_id: number,
  ): Promise<product | null> {
    return this.productService.getProduct(product_id);
  }

  @Delete(':product_id')
  async deleteProduct(
    @Param('product_id') product_id: number,
  ): Promise<product> {
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
    @Body() data: Partial<product>,
  ) {
    return this.productService.updateProduct(product_id, data);
  }
}
