import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EventRepository } from '../events/events.repository';
import { RegistrationRepository } from '../registrations/registrations.repository';
import { WaitlistRepository } from 'src/modules/waitlist/waitlist.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly eventRepo: EventRepository,
    private readonly registrationRepo: RegistrationRepository,
    private readonly waitlistRepo: WaitlistRepository,
  ) {}

  async getAttendeesByEvent(
    eventId: string,
    userId: string,
    page: number,
    limit: number,
  ) {
    const event = await this.eventRepo.findEventById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.user_id !== userId) {
      throw new ForbiddenException(
        'You can only view attendees for your own event',
      );
    }

    const skip = (page - 1) * limit;
    const { data: attendees, total } =
      await this.registrationRepo.getAttendeesByEvent(eventId, skip, limit);

    return {
      total,
      page,
      limit,
      attendees,
    };
  }

  async getWaitlistByEvent(
    eventId: string,
    userId: string,
    page: number,
    limit: number,
  ) {
    const event = await this.eventRepo.findEventById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.user_id !== userId) {
      throw new ForbiddenException(
        'You can only view the waitlist for your own event',
      );
    }

    const skip = (page - 1) * limit;
    const { data: waitlist, total } =
      await this.waitlistRepo.getWaitlistByEvent(eventId, skip, limit);

    return {
      total,
      page,
      limit,
      waitlist,
    };
  }
}