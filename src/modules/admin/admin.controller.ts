import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/auth.guards';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { AuthRequest } from 'src/common/interfaces/authRequest.interface';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @Get('events/:eventId/attendees')
  async getAttendeesPerEvent(
    @Param('eventId') eventId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: AuthRequest,
  ) {
    const eventList = await this.adminService.getAttendeesByEvent(
      eventId,
      req.user.id,
      Number(page),
      Number(limit),
    );
    return {
      message: 'Event list successfully fetched',
      data: eventList,
    };
  }

  @Roles(Role.ADMIN)
  @Get('events/:eventId/waitlist')
  async getWaitlistPerEvent(
    @Param('eventId') eventId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: AuthRequest,
  ) {
    const waitlist = await this.adminService.getWaitlistByEvent(
      eventId,
      req.user.id,
      Number(page),
      Number(limit),
    );
    return {
      message: 'Event waitlist succesfully fetched',
      data: waitlist,
    };
  }
}