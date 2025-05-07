import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module'; 
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './Module/mailer.module';
import { KpiModule } from './dashboard/admin/kpi.module';
@Module({
  imports: [ProductModule, CategoryModule, UserModule, AuthModule,MailerModule,KpiModule],
  controllers: [], 
})
export class AppModule {}