import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class KpiBuyerService {
  constructor(private readonly prisma: PrismaService) {}

  // KPI 2: Active Product Listings
  async getBuyerKpis(buyerId: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const completedOrdersThisMonth = await this.prisma.order.count({
      where: {
        user_id: buyerId,
        date: { gte: startOfMonth },
        status: { in: ['Processing', 'Ready'] },
      },
    });

    const repeatPurchaseProductCount = await this.prisma.orderItem.groupBy({
      by: ['product_id'],
      where: {
        order: {
          user_id: buyerId,
        },
      },
      _count: {
        product_id: true,
      },
      having: {
        product_id: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    const averageOrderValue = await this.prisma.order.aggregate({
      _avg: {
        total_amount: true,
      },
      where: {
        user_id: buyerId,
      },
    });

    const lastOrder = await this.prisma.order.findFirst({
      where: { user_id: buyerId },
      orderBy: { date: 'desc' },
    });

    const daysSinceLastPurchase = lastOrder
      ? Math.floor(
          (now.getTime() - new Date(lastOrder.date).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    return {
      completedOrdersCount: completedOrdersThisMonth,
      repeatPurchaseProductCount: repeatPurchaseProductCount.length,
      averageOrderValue: Number(averageOrderValue._avg.total_amount ?? 0),
      daysSinceLastPurchase,
    };
  }
}
