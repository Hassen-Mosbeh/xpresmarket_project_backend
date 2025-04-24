import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { PrismaModule } from '../prisma.module';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  imports: [PrismaModule], 
  providers: [OrderService],
  // exports: [OrderService] 
})
export class OrderModule {}
