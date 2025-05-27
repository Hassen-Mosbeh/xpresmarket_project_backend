import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { message } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage({
    senderId,
    receiverId,
    content,
  }: {
    senderId: number;
    receiverId: number;
    content: string;
  }): Promise<message> {
    const message = await this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });

    return message;
  }

  async getMessagesBetweenUsers(
    user1: number,
    user2: number,
  ): Promise<message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      orderBy: { timestamp: 'asc' },
    });

    return messages;
  }

  async getUnreadCount(userId: number): Promise<Record<number, number>> {
    const messages = await this.prisma.message.findMany({
      where: {
        receiverId: userId,
        read: false,
      },
    });

    const counts: Record<number, number> = {};
    for (const msg of messages) {
      counts[msg.senderId] = (counts[msg.senderId] || 0) + 1;
    }

    return counts;
  }

  async markMessagesAsRead(userId: number, partnerId: number): Promise<void> {
    await this.prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: partnerId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }
}
