import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { StripeService } from "../stripe/stripe.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("subscription")
@UseGuards(JwtAuthGuard) // ✅ добавляем guard
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
    private stripeService: StripeService,
  ) {}

  @Get()
  getSubscription(@Req() req) {
    return this.subscriptionService.getUserSubscription(req.user.id);
  }

  @Post("checkout")
  async checkout(@Req() req) {
    const url = await this.stripeService.createCheckoutSession(req.user.id);

    return {
      checkoutUrl: url,
    };
  }

  @Post("cancel")
  cancel(@Req() req) {
    return this.subscriptionService.cancelSubscription(req.user.id);
  }
}