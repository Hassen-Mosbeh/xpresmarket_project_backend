import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { KpiBuyerService } from "./kpiBuyer.service";


@Controller('api/v1/kpiBuyer')
export class KpiBuyerController {
  constructor(private readonly buyerKpiService: KpiBuyerService) {}

  @Get(':id')
getBuyerKpi(@Param('id', ParseIntPipe) id: number) {
  return this.buyerKpiService.getBuyerKpis(id);
}
}
  