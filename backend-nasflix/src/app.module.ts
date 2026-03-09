import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersModule } from './users/users.module';
import { StripeModule } from './stripe/stripe.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MyListModule } from './my-list/my-list.module';
import { WatchProgressModule } from './watch-progress/watch-progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProfilesModule,
    UsersModule,
    SubscriptionModule,
    StripeModule,
    MyListModule,
    WatchProgressModule,
  ],
})
export class AppModule {}
