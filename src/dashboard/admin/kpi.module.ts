import { Module } from "@nestjs/common";
import { KpiController } from "./kpi.controller";
import { KpiService } from "./kpi.service";
import { PrismaService } from "src/prisma.service";

@Module({
    controllers: [KpiController],
    providers: [KpiService,PrismaService],
  })
  export class KpiModule {}
  