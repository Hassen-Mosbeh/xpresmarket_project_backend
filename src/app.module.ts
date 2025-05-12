
import { ContactModule } from './contact/contact.module'; 
import { StripeModule } from './stripe/stripe.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { KpiModule } from './dashboard/admin/kpi.module';
import { MailerModule } from './Module/mailer.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { KpiBuyerModule } from './dashboard/buyer/kpiBuyer.module';
import { KpiSellerModule } from './dashboard/seller/kpiSeller.module';
@Module({
  imports: [
    ProductModule,
    ContactModule,
    CategoryModule,
    UserModule,
    AuthModule,
    MailerModule,
    StripeModule,
    OrderModule,
    PrismaModule,
    KpiModule,
    KpiBuyerModule,
    KpiSellerModule,
  ],
  controllers: [],

})
export class AppModule {}
