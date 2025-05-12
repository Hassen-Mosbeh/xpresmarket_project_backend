// seller-kpi.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SellerKpiService {
  constructor(private prisma: PrismaService) {}

  async getSellerKpis(sellerId: number) {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const listedProductsCount = await this.prisma.product.count({
      where: {
        ownerId: sellerId,
      },
    });

    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              ownerId: sellerId,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const calculateRevenue = (startDate: Date) => {
      return orders
        .filter((order) => order.date >= startDate)
        .reduce(
          (sum, order) => sum + parseFloat(order.total_amount.toString()),
          0,
        );
    };

    const totalRevenueToday = calculateRevenue(startOfDay);
    const totalRevenueThisMonth = calculateRevenue(startOfMonth);
    const totalRevenueThisYear = calculateRevenue(startOfYear);

    // Breakdown: Monthly (last 6 months)
    const monthly: { name: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0,
      );

      const revenue = orders
        .filter((order) => order.date >= monthDate && order.date <= monthEnd)
        .reduce(
          (sum, order) => sum + parseFloat(order.total_amount.toString()),
          0,
        );

      monthly.push({
        name: monthDate.toLocaleString('default', { month: 'short' }),
        revenue: parseFloat(revenue.toFixed(2)),
      });
    }

    // Breakdown: Yearly (last 4 years)
    const yearly: { name: string; revenue: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const yearStart = new Date(now.getFullYear() - i, 0, 1);
      const yearEnd = new Date(now.getFullYear() - i + 1, 0, 1);

      const revenue = orders
        .filter((order) => order.date >= yearStart && order.date < yearEnd)
        .reduce(
          (sum, order) => sum + parseFloat(order.total_amount.toString()),
          0,
        );

      yearly.push({
        name: `${yearStart.getFullYear()}`,
        revenue: parseFloat(revenue.toFixed(2)),
      });
    }

    const allItems = orders.flatMap((order) => order.items);

    const productStats: Record<
      number,
      {
        count: number;
        product_name: string;
        totalRevenue: number;
      }
    > = {};

    allItems.forEach((item) => {
      const productId = item.product_id;
      const name = item.product.product_name;
      const price = parseFloat(item.product.price.toString());

      if (!productStats[productId]) {
        productStats[productId] = {
          count: 0,
          product_name: name,
          totalRevenue: 0,
        };
      }

      productStats[productId].count += item.quantity;
      productStats[productId].totalRevenue += item.quantity * price;
    });

    // Get most demanded product (by quantity sold)
    let mostDemandedProduct: {
      product_id: number;
      product_name: string;
      count: number;
    } | null = null;

    let bestSellingProduct: {
      product_id: number;
      product_name: string;
      totalRevenue: number;
    } | null = null;

    let leastSellingProduct: {
      product_id: number;
      product_name: string;
      count: number;
    } | null = null;

    
    const productEntries = Object.entries(productStats);

    if (productEntries.length > 0) {
      const byDemand = [...productEntries].sort(
        ([, a], [, b]) => b.count - a.count,
      );
      mostDemandedProduct = {
        product_id: Number(byDemand[0][0]),
        product_name: byDemand[0][1].product_name,
        count: byDemand[0][1].count,
      };

      const byRevenue = [...productEntries].sort(
        ([, a], [, b]) => b.totalRevenue - a.totalRevenue,
      );
      bestSellingProduct = {
        product_id: Number(byRevenue[0][0]),
        product_name: byRevenue[0][1].product_name,
        totalRevenue: byRevenue[0][1].totalRevenue,
      };

      const byLeast = [...productEntries].sort(
        ([, a], [, b]) => a.count - b.count,
      );
      leastSellingProduct = {
        product_id: Number(byLeast[0][0]),
        product_name: byLeast[0][1].product_name,
        count: byLeast[0][1].count,
      };
    }

    return {
      listedProductsCount,
      totalRevenueToday,
      totalRevenueThisMonth,
      totalRevenueThisYear,
      revenueBreakdown: {
        monthly,
        yearly,
      },
      mostDemandedProduct: mostDemandedProduct ?? null,
      bestSellingProduct: bestSellingProduct ?? null,
      leastSellingProduct: leastSellingProduct ?? null,
    };
  }
}
