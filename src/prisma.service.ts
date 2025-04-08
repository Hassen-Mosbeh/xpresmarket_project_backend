import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // Connect to the database when the module initializes
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Disconnect from the database when the module is destroyed
  }

  async enableShutdownHooks(app: INestApplication) { // Use NestJS's shutdown hooks to disconnect Prisma
    
   app.enableShutdownHooks();
  }

  async findByEmail(email: string) {
    return this.user.findUnique({
      where: { email },
    });
  }

  async updateResetCode(email: string, resetCode: string) {
    return this.user.update({
      where: { email },
      data: {
        resetCode,
        resetCodeExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
  }

  async updatePassword(email: string, hashedPassword: string) {
    return this.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpiresAt: null,
      },
    });
  }
}