import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  Req,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilesService } from './profiles.service';
import { multerConfig } from './multer.config';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  getMyProfiles(@Req() req: any) {
    return this.profilesService.getUserProfiles(req.user.id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadAvatar(
    @Param('id') profileId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const avatarPath = `/uploads/avatars/${file.filename}`;

    return this.profilesService.updateAvatar(
      req.user.id,
      profileId,
      avatarPath,
    );
  }
}
