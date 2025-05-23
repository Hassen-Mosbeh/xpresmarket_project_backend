import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class KpiBuyerService {
  constructor(private readonly prisma: PrismaService) {}

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

    const totalOrders = await this.prisma.order.count({
      where: { user_id: buyerId },
    });

    const totalSpent = await this.prisma.order.aggregate({
      _sum: { total_amount: true },
      where: { user_id: buyerId },
    });

    const totalItems = await this.prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        order: { user_id: buyerId },
      },
    });

    const monthlySpending = await this.prisma.order.findMany({
      where: {
        user_id: buyerId,
        date: { gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) },
      },
      select: {
        total_amount: true,
        date: true,
      },
    });

    const monthlyData = monthlySpending.reduce((acc, order) => {
      const date = new Date(order.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      acc[key] = (acc[key] || 0) + Number(order.total_amount);
      return acc;
    }, {} as Record<string, number>);

    return {
      completedOrdersCount: completedOrdersThisMonth,
      repeatPurchaseProductCount: repeatPurchaseProductCount.length,
      averageOrderValue: Number(averageOrderValue._avg.total_amount ?? 0),
      daysSinceLastPurchase,
      totalOrders,
      totalSpent: Number(totalSpent._sum.total_amount ?? 0),
      totalItemsPurchased: Number(totalItems._sum.quantity ?? 0),
      monthlyTrend: Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount,
      })),
    };
  }
}
