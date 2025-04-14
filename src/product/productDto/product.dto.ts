import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsInt()
  @IsOptional()
  product_id: number;
  
  @IsString()
  product_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsInt()
  category_id?: number;

}


export class GetProductDto {
  @IsInt()
  @IsOptional()
  product_id: number;
  
  @IsString()
  product_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsString()
  category:{
    category_name?:string;
  };
  

  @IsString()
  owner: {  
    username: string;
  };
}

  export class UpdateProductDto {
    @IsOptional()
    @IsInt()
    product_id: number;
  
    @IsOptional()
    @IsString()
    product_name?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsNumber()
    price?: number;
  
    @IsOptional()
    @IsInt()
    stock?: number;
  
    @IsOptional()
    @IsBoolean()
    status?: boolean;
  
    @IsOptional()
    @IsString()
    image?: string;
  
    @IsOptional()
    @IsInt()
    category_id?: number;
  }

