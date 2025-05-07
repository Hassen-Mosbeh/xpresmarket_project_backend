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
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { product } from '@prisma/client';
import { CreateProductDto, GetProductDto, UpdateProductDto } from './productDto/product.dto';
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
  ): Promise<GetProductDto | null> {
    return await this.productService.getProduct(product_id) as unknown as GetProductDto;
  }

  @Delete(':product_id')
  async deleteProduct(
    @Res() response: Response,
    @Param('product_id') product_id: number,
    
  ): Promise<any> {
    const result = await this.productService.deleteProduct(product_id);
    return response.status(200).json({
      status: "Ok!",
      message:"Product deleted Successfully",
      result: result,
    });
  }

  // @Put(':product_id')
  // async updateProduct(
  //   @Param('product_id') product_id: number,
  //   @Body() data: Product,
  // ): Promise<Product> {
  //   return this.productService.updateProduct(product_id, data);
  // }

  @Patch(':product_id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateProductPatch(
    @Param('product_id') product_id: string,
    @Body() data: UpdateProductDto
  ) {
    return this.productService.updateProduct(Number(product_id), data);
  }
  

@UseGuards(JwtGuard)
@Get('seller/:id')
async getSellerProducts(@Param('id', ParseIntPipe) sellerId: number) {
  try {
    const products = await this.productService.getProductsBySeller(sellerId);
    return {
      success: true,
      data: products
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
}
}
