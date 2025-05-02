import { Controller, Get } from '@nestjs/common';
import { KpiService } from './kpi.service';

@Controller('api/v1/kpi')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}


  @Get('active-products')
  getActiveProducts() {
    return this.kpiService.getActiveProductListingsKPI();
  }

  @Get('new-users')
  getNewUsers() {
    return this.kpiService.getNewUsersKPI();
  }
}
