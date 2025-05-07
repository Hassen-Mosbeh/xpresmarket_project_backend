import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma.service';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-03-31.basil',
    });
  }

  async createPaymentIntent(amount: number, user_id: number, product_id: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: {
        user_id: user_id.toString(),
        product_id: product_id.toString(),
        price: amount.toString(), // utile pour le détail de l’item
      },
    });

    return paymentIntent.client_secret;
  }

  async handleWebhook(req: Request, res: Response, sig: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (err) {
      this.logger.error('Erreur de vérification du webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handleSuccessfulPayment(event);
        break;
      default:
        this.logger.log(`Événement Stripe non géré: ${event.type}`);
    }

    res.json({ received: true });
  }

  private async handleSuccessfulPayment(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { metadata } = paymentIntent;
    const amount = paymentIntent.amount / 100;

    try {
      await this.prisma.order.create({
        data: {
          user_id: parseInt(metadata.user_id),
          payment_method: 'stripe',
          total_amount: new Prisma.Decimal(amount),
          status: 'Pending',
          items: {
            create: [
              {
                product_id: parseInt(metadata.product_id),
                quantity: 1,
                price: new Prisma.Decimal(metadata.price),
              },
            ],
          },
        },
      });

      this.logger.log(
        `✅ Paiement réussi (${paymentIntent.id}). Commande créée pour l'utilisateur ${metadata.user_id}`,
      );
    } catch (error) {
      this.logger.error(
        `Échec de la création de commande pour le paiement ${paymentIntent.id}:`,
        error.message,
      );
    }
  }
}
