// src/order/order.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './transaction.service';

@Controller('api/v1/transactions')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getTransactions() {
    return this.orderService.getTransactions();
  }

  @Get('/buyer/:userId')
  getBuyerTransactions(@Param('userId') userId: string) {
    return this.orderService.getTransactionsForBuyer(+userId);
  }

  @Get('/seller/:ownerId')
  getSellerTransactions(@Param('ownerId') ownerId: string) {
    return this.orderService.getTransactionsForSeller(+ownerId);
  }
}
