import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dtos/createEvent.dto';
import { UpdateEventDto } from './dtos/updateEvent.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guards';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { AuthRequest } from 'src/common/interfaces/authRequest.interface';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createEvent(@Body() dto: CreateEventDto, @Req() req: AuthRequest) {
    const userId = req.user.id;
    const event = await this.eventService.createEvent(userId, dto);
    return {
      message: 'Event successfully created',
      data: event,
    };
  }

  @Get()
  async getAllEvents() {
    const events = await this.eventService.getAllEvents();
    return {
      messsage: 'Successfully fetched all events',
      data: events,
    };
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    const event = await this.eventService.getEventById(id);
    return {
      message: 'Successfully fetched events',
      data: event,
    };
  }

  @Get('my-events')
  async getMyEvents(@Request() req) {
    const myEvents = await this.eventService.findEventsByUser(req.user.id);
    return {
      message: 'Successfully fetched users event',
      data: myEvents,
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const updatedEvent = await this.eventService.updateEvent(
      id,
      updateEventDto,
    );
    return {
      message: 'Event updated successfully',
      data: updatedEvent,
    };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteEvent(@Param('id') id: string) {
    const result = await this.eventService.deleteEvent(id);
    return {
      messsage: 'Event successfully deleted',
      data: result,
    };
  }
}