// src/users/users.controller.ts

import { Controller, Get } from '@nestjs/common'
import { UsersService } from './users.service' 
import { CurrentUser } from './decorators/user.decorator'
import { Auth } from '../auth/decorators/auth.decorator'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Auth()
	@Get('profile')
	async getProfile(@CurrentUser('id') id: string) {
		return this.usersService.getById(id)
	}
}