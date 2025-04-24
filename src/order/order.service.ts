import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './orderdto/order.dto';
import { orderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      // Vérifier que l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: createOrderDto.user_id },
      });
      if (!user) {
        throw new NotFoundException(`Utilisateur ${createOrderDto.user_id} introuvable`);
      }

      // Vérifier que chaque produit existe
      for (const item of createOrderDto.items) {
        const product = await this.prisma.product.findUnique({
          where: { product_id: item.product_id },
        });
        if (!product) {
          throw new NotFoundException(`Produit ${item.product_id} introuvable`);
        }
      }

      // Créer la commande et les items en transaction
      const newOrder = await this.prisma.order.create({
        data: {
          user_id: createOrderDto.user_id,
          payment_method: createOrderDto.payment_method,
          payment_id: createOrderDto.payment_id,
          total_amount: createOrderDto.total_amount,
          notes: createOrderDto.notes,
          status: orderStatus.Pending,
          items: {
            create: createOrderDto.items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      return newOrder;
    } catch (error) {
      this.logger.error(
        `Erreur création commande utilisateur ${createOrderDto.user_id}`,
        error.stack,
      );
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Erreur lors de la création de la commande');
    }
  }

  async getOrders(status?: string, userId?: number) {
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.user_id = userId;

    try {
      return await this.prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, email: true } },
          items: {
            include: { product: true },
          },
        },
        orderBy: { date: 'desc' },
      });
    } catch (error) {
      this.logger.error('Erreur récupération des commandes', error.stack);
      throw new InternalServerErrorException('Erreur serveur');
    }
  }

  async getOrderById(id: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { order_id: id },
        include: {
          user: { select: { id: true, email: true, telephone: true } },
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Commande ${id} introuvable`);
      }

      return order;
    } catch (error) {
      this.logger.error(`Erreur récupération commande ${id}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Erreur serveur');
    }
  }

  async updateOrderStatus(id: number, status: orderStatus) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { order_id: id },
      });
      if (!order) {
        throw new NotFoundException(`Commande ${id} introuvable`);
      }

      return await this.prisma.order.update({
        where: { order_id: id },
        data: { status },
        include: {
          user: { select: { email: true } },
          items: {
            include: { product: true },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Erreur mise à jour statut commande ${id}`, error.stack);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Erreur serveur');
    }
  }
}
