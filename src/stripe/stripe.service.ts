import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    // On initialise Stripe avec la clé secrète depuis le .env
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: '2025-03-31.basil', // Version que ta version de Stripe attend
      });
  }

  // Fonction pour créer un PaymentIntent
  async createPaymentIntent(amount: number) {
    // Stripe demande les montants en CENTIMES (donc * 100)
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,       // Montant total du paiement en centimes
      currency: 'usd',            // Devise (tu peux mettre 'eur' par exemple)
    });

    // On retourne le "client_secret" pour le frontend (Next.js)
    return paymentIntent.client_secret;
  }
}
