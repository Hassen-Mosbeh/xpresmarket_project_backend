import { Module } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { KpiSellerController } from "./kpiSeller.controller";
import { SellerKpiService } from "./kpiSeller.service";

@Module({
    controllers: [KpiSellerController],
    providers: [SellerKpiService,PrismaService],
  })
  export class KpiSellerModule {}
  