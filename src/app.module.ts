import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './Module/mailer.module';
<<<<<<< HEAD
import { KpiModule } from './dashboard/admin/kpi.module';
@Module({
  imports: [ProductModule, CategoryModule, UserModule, AuthModule,MailerModule,KpiModule],
  controllers: [], 
=======
import { ContactModule } from './contact/contact.module';
import { StripeModule } from './stripe/stripe.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma.module';
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
  ],
  controllers: [],
>>>>>>> B2
})
export class AppModule {}
