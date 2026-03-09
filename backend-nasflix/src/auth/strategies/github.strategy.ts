import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-github2'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: config.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL:
        config.getOrThrow<string>('SERVER_URL') +
        '/auth/github/callback',
      scope: ['user:email'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const email = profile.emails?.[0]?.value as string
    const name = profile.username as string
    const avatar = profile.photos?.[0]?.value 

    return this.authService.validateOAuthUser({
      email,
      name,
      avatar,
    })
  }
}