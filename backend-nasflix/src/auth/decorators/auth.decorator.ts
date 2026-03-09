import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export function Auth() {
  return UseGuards(AuthGuard('jwt'))
}