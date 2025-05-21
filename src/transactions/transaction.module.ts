import { Module } from '@nestjs/common';
import { OrderService } from './transaction.service'; 
import { PrismaModule } from '../prisma.module';
import { OrderController } from './transaction.controller'; 

@Module({
  controllers: [OrderController],
  imports: [PrismaModule], 
  providers: [OrderService],
  // exports: [OrderService] 
})
export class TransactionModule {}
