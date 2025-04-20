import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { CreateOrderDto } from './orderdto/order.dto';
import { UpdateOrderStatusDto } from './orderdto/update_status_order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {  // Correction: Nom de la classe en PascalCase
  constructor(private readonly orderService: OrderService) {}  // Typage explicite du service
  
  // Créer une commande
  @Post()
  async createOrder(@Body() data , createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder( data ,createOrderDto);  // Correction : utilisation correcte de createOrderDto
  }

  // Récupérer toutes les commandes
  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  // Mettre le statut du commande à "Delivered"
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,  // Correction : nom de la variable en camelCase
  ) {
    return this.orderService.updateOrderStatus(
      +id,  // Convertir 'id' en number
      updateOrderStatusDto.status,  // Correction : utilisation correcte de updateOrderStatusDto
    );
  }
}
