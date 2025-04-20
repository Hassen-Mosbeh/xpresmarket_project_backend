import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { orderStatus } from '@prisma/client';




@Injectable()
export class OrderService {
    constructor(private prisma :PrismaService   ) {}
    // creer une commande 
    async createOrder(data, createOrderDto) {
        return this.prisma.order.create({
            data:{
                ...data,
                status:orderStatus.Pending,
            },
        });
    }

    //La recuperation de tous les commandes
    async getAllOrders(){
        return this.prisma.order.findMany({
            include:{
                user:true,
                product:true
            },
        });
    }

    //mettre à jour le status 
    async updateOrderStatus(order_id: number, status: orderStatus) {
        return this.prisma.order.update({
          where: { order_id },  // Utilisation correcte de la clé `order_id`
          data: { status },      // Mise à jour correcte du statut
        });
      }
        
}
