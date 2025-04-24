import { IsEnum } from 'class-validator';
import { orderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(orderStatus) // Validation stricte des valeurs de l'enum
  status: orderStatus; // Correspond exactement à votre enum Prisma
}