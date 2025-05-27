import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RegistrationRepository } from './registrations.repository';
import { ForbiddenException } from '@nestjs/common';
import { EventRepository } from '../events/events.repository';
import { WaitlistService } from 'src/modules/waitlist/waitlist.service';
import { parse } from 'json2csv';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly registrationRepository: RegistrationRepository,
    private readonly eventRepository: EventRepository,
    private readonly waitlistService: WaitlistService,
  ) {}

  async registerUserForEvent(userId: string, eventId: string) {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isAlreadyRegistered =
      await this.registrationRepository.isUserRegistered(eventId, userId);
    if (isAlreadyRegistered) {
      throw new BadRequestException(
        'User is already registered for this event',
      );
    }

    const currentCount =
      await this.registrationRepository.countRegistrationsForEvent(eventId);
    if (currentCount >= event.capacity) {
      throw new BadRequestException(
        'Event is at full capacity, Join The WaitList',
      );
    }

    return this.registrationRepository.createRegistration(eventId, userId);
  }

  async validateEventOwnership(eventId: string, userId: string) {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.user_id !== userId) {
      throw new ForbiddenException('You can only access your own events');
    }
  }

  generateCsv(attendees: any[]): string {
    return parse(attendees, {
      fields: ['id', 'name', 'email', 'registered_at'],
    });
  }

  async cancelRegistration(eventId: string, userId: string): Promise<void> {
    const removed = await this.registrationRepository.removeRegistration(
      eventId,
      userId,
    );

    if (!removed) {
      throw new NotFoundException(
        'Registration not found or already cancelled',
      );
    }

    await this.waitlistService.promoteNextUser(eventId);
  }
}