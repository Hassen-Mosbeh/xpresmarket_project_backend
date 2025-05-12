import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { KpiBuyerController } from "./kpiBuyer.controller";
import { KpiBuyerService } from "./kpiBuyer.service";

@Module({
    controllers: [KpiBuyerController],
    providers: [KpiBuyerService,PrismaService],
  })
  export class KpiBuyerModule {}
  