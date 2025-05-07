import { Controller, Post, Body, Req, Res, Headers } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';

@Controller('api/v1/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  /**
   * Crée un PaymentIntent Stripe (démarre le processus de paiement)
   * @param body 
   * @returns Le clientSecret pour confirmer le paiement côté client
   */
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; user_id: number; product_id: number },
  ) {
    const clientSecret = await this.stripeService.createPaymentIntent(
      body.amount,
      body.user_id,
      body.product_id,
    );
    return { clientSecret };
  }

  /**
   * Endpoint webhook pour les notifications Stripe
   * @param request Requête HTTP
   * @param response Réponse HTTP
   * @param signature Signature Stripe pour vérification
   * @returns Réponse JSON
   */
  @Post('webhook')
  async handleStripeWebhook(
    @Req() request: Request,
    @Res() response: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(request, response, signature);
  }
}