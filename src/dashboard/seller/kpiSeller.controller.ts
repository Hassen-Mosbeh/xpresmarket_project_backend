import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import {  SellerKpiService } from "./kpiSeller.service";


@Controller('api/v1/kpiSeller')
export class KpiSellerController {
  constructor(private readonly sellerKpiService: SellerKpiService) {}

@Get(':id')
getSellerKpi(@Param('id', ParseIntPipe) id: number) {
  return this.sellerKpiService.getSellerKpis(id);
}
}
