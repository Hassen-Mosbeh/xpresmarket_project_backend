import { IsNumber, IsString, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNumber()
  @IsPositive()
  product_id: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number; 
}

export class CreateOrderDto {

  @IsNumber()
  @IsPositive()
  user_id: number;

  @IsString()
  payment_method: string;

  @IsString()
  payment_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @IsPositive()
  total_amount: number;

  
}
