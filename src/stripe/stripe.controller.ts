import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  // On injecte le service Stripe via le constructeur (injection de dépendance)
  constructor(private readonly stripeService: StripeService) {}

  // Cette méthode est appelée quand le client veut initier un paiement
  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number }) {
    // On appelle la méthode du service Stripe pour créer un Payment Intent avec le montant reçu
    const clientSecret = await this.stripeService.createPaymentIntent(body.amount);
    
    // Il sera utilisé côté client pour finaliser le paiement avec Stripe.js
    return { clientSecret };
  }
}
