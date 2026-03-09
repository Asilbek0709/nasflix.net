import { Controller, Post, Req, Res } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("stripe")
export class StripeController {
  constructor(private prisma: PrismaService) {}

  @Post("webhook")
  async webhook(@Req() req, @Res() res) {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = session.metadata.userId;

      const stripeCustomerId = session.customer;
      const stripeSubscriptionId = session.subscription;

      await this.prisma.subscription.upsert({
        where: {
          userId,
        },

        update: {
          status: "ACTIVE",
          stripeCustomerId,
          stripeSubscriptionId,
        },

        create: {
          userId,
          planId: "premium-plan-id",
          status: "ACTIVE",
          stripeCustomerId,
          stripeSubscriptionId,
        },
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      await this.prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId: subscription.id,
        },

        data: {
          status: "CANCELED",
        },
      });
    }

    res.json({ received: true });
  }
}