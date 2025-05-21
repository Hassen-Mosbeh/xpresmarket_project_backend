// src/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service'; 

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getTransactions() {
    return this.prisma.order.findMany({
      select: {
        order_id: true,
        total_amount: true,
        status: true,
        payment_method: true,
        date: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }
  // For Buyers (user who placed the order)
async getTransactionsForBuyer(userId: number) {
  return this.prisma.order.findMany({
    where: { user_id: userId },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });
}

// For Sellers (user who owns the product)
async getTransactionsForSeller(ownerId: number) {
  return this.prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            ownerId: ownerId,
          },
        },
      },
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });
}

}
