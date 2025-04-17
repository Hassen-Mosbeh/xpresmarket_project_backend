import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

// Le module Stripe permet de regrouper tous les composants liés à Stripe : service + controller
@Module({
  controllers: [StripeController], 
  providers: [StripeService],      // Le service contient la logique métier (ex: création du paiement)
})
export class StripeModule {}
