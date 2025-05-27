import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { JwtAuthGuard } from 'src/common/guards/auth.guards';

@Controller('waitlist')
@UseGuards(JwtAuthGuard)
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post('events/:eventId/join')
  async joinWaitlist(@Param('eventId') eventId: string, @Req() req) {
    const userId = req.user.id;
    const result = await this.waitlistService.joinWaitlist(eventId, userId);
    return {
      message: 'Joined the event waitlist successfully',
      data: result,
    };
  }

  @Get('my')
  async getUserWaitlist(@Req() req) {
    const userId = req.user.id;
    const waitlists = await this.waitlistService.getUserWaitlist(userId);
    return {
      message: 'Successfully fetched user waitlists',
      data: waitlists,
    };
  }

  @Delete('events/:eventId/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveWaitlist(@Param('eventId') eventId: string, @Req() req) {
    const userId = req.user.id;
    const result = await this.waitlistService.leaveWaitlist(eventId, userId);
    return {
      message: 'Left event waitlist successfully',
      data: result,
    };
  }
}