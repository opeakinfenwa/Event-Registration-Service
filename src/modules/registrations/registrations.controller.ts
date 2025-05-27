import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RegistrationService } from './registrations.service';
import { JwtAuthGuard } from 'src/common/guards/auth.guards';
import { AuthRequest } from 'src/common/interfaces/authRequest.interface';

@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':eventId')
  async registerForEvent(
    @Param('eventId') eventId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.id;
    const result = await this.registrationService.registerUserForEvent(
      userId,
      eventId,
    );
    return {
      message: 'Event registration successfull',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':eventId')
  async cancelRegistration(
    @Param('eventId') eventId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.id;
    const result = await this.registrationService.cancelRegistration(
      userId,
      eventId,
    );
    return {
      message: 'Successfully canceled registration',
      data: result,
    };
  }
}