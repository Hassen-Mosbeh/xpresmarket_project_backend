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

  @Get('user-roles')
  async getUserRolesKpi() {
    return this.kpiService.getUserRolesKpi();
  }

   @Get('user-status')
  getUserStatus() {
    return this.kpiService.getUserStatusCounts();
  }

  @Get('contact-requests')
  getContactRequests() {
    return this.kpiService.getContactRequestCount();
  }

  @Get('top-company-addresses')
  getTopCompanyAddresses() {
    return this.kpiService.getTopCompanyAddresses();
  }
}
