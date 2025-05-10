import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './orderdto/order.dto';
import { UpdateOrderStatusDto } from './orderdto/update_status_order.dto';

@Controller('api/v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Crée une nouvelle commande (utilisé par le webhook Stripe)
   * @param createOrderDto Données de la commande
   * @returns La commande créée
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  /**
   * Récupère toutes les commandes avec filtres optionnels
   * @param status Filtre par statut (optionnel)
   * @param userId Filtre par utilisateur (optionnel)
   * @returns Liste des commandes
   */
  @Get()
  async getOrders(
    @Query('status') status?: string,
    @Query('userId') userId?: string,
  ) {
    return this.orderService.getOrders(
      status?.toString(),
      userId ? +userId : undefined,
    );
  }

  /**
   * Récupère une commande spécifique
   * @param id ID de la commande
   * @returns Détails de la commande
   */
  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(+id);
  }

  /**
   * Met à jour le statut d'une commande
   * @param id ID de la commande
   * @param updateOrderStatusDto Nouveau statut
   * @returns Commande mise à jour
   */

  @Get('/buyer/:userId')
  async getOrdersForBuyer(@Param('userId') userId: string) {
    return this.orderService.getOrdersForBuyer(+userId);
  }

  @Get('/seller/:ownerId')
  async getOrdersForSeller(@Param('ownerId') ownerId: string) {
    return this.orderService.getOrdersForSeller(+ownerId);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(
      +id,
      updateOrderStatusDto.status,
    );
  }
}
