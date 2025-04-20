
import { IsEnum } from 'class-validator';
import { orderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(orderStatus)
  status: orderStatus; 
}
