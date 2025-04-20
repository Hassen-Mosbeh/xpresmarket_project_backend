import { IsNumber, IsString, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  user_id: number;

  @IsNumber()
  @IsPositive()
  product_id: number;

  @IsString()
  payement_method: string;

  @IsNumber()
  @IsPositive()
  total_amount: number;
}
