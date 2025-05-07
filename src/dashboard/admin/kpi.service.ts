import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { subMonths, startOfMonth } from 'date-fns';

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  // KPI 2: Active Product Listings
  async getActiveProductListingsKPI() {
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1); // last 6 months

    const results: { month: string; count: number }[] = [];

    for (let i = 0; i < 6; i++) {
      const start = new Date(
        startMonth.getFullYear(),
        startMonth.getMonth() + i,
        1,
      );
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

      const count = await this.prisma.product.count({
        where: {
          status: true,
          createdAtpnproduct: {
            gte: start,
            lt: end,
          },
        },
      });

      results.push({
        month: start.toLocaleString('default', { month: 'short' }),
        count,
      });
    }

    return results;
  }

  // KPI 3: New Users This Month + Growth
  async getNewUsersKPI() {
    const now = new Date();
    const monthsToShow = 6;

    // Explicitly define the type of results
    const results: { month: string; count: number }[] = [];

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const start = startOfMonth(subMonths(now, i));
      const end = startOfMonth(subMonths(now, i - 1));

      const count = await this.prisma.user.count({
        where: {
          createdAt: {
            gte: start,
            lt: end,
          },
        },
      });

      results.push({
        month: start.toLocaleString('default', { month: 'short' }),
        count,
      });
    }

    return results;
  }

  // kpi.service.ts

 // kpi.service.ts

async getUserRolesKpi() {
  const [totalUsers, totalBuyers, totalSellers] = await Promise.all([
    this.prisma.user.count(),
    this.prisma.user.count({ where: { profile: 'Buyer' } }),
    this.prisma.user.count({ where: { profile: 'Seller' } }),
  ]);

  function calcPercentage(roleCount: number, total: number): number {
    if (total === 0) return 0;
    return (roleCount / total) * 100;
  }

  return {
    buyer: {
      count: totalBuyers,
      percentage: calcPercentage(totalBuyers, totalUsers),
    },
    seller: {
      count: totalSellers,
      percentage: calcPercentage(totalSellers, totalUsers),
    },
  };
}

}
