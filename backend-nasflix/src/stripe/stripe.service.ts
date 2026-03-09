import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }

  async createCheckoutSession(userId: string) {
    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],

      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,

      metadata: {
        userId,
      },
    });

    return session;
  }

  getStripe() {
    return this.stripe;
  }
}