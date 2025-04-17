import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module'; 
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './Module/mailer.module';
import { ContactModule } from './contact/contact.module';
import { StripeModule } from './stripe/stripe.module';
@Module({
  imports: [ProductModule, ContactModule, CategoryModule, UserModule, AuthModule,MailerModule,StripeModule ],
  controllers: [], 
})
export class AppModule {}