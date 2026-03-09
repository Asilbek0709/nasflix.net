import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getUserSubscription(userId: string) {
    return this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
  }

  async cancelSubscription(userId: string) {
    return this.prisma.subscription.update({
      where: { userId },
      data: {
        status: "CANCELED",
      },
    });
  }
}