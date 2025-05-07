import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  providers: [ContactService,PrismaService],
  controllers: [ContactController]
})
export class ContactModule {}
