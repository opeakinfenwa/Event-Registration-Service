import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { WaitlistRepository } from './waitlist.repository';
import { RegistrationRepository } from '../registrations/registrations.repository';
import { EventRepository } from '../events/events.repository';

@Injectable()
export class WaitlistService {
  constructor(
    private readonly waitlistRepo: WaitlistRepository,
    private readonly registrationRepo: RegistrationRepository,
    private readonly eventRepo: EventRepository,
  ) {}

  async joinWaitlist(eventId: string, userId: string) {
    const event = await this.eventRepo.findEventById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isAlreadyRegistered = await this.registrationRepo.isUserRegistered(
      eventId,
      userId,
    );
    if (isAlreadyRegistered) {
      throw new ConflictException('You are already registered for this event');
    }

    const isAlreadyOnWaitlist = await this.waitlistRepo.isUserAlreadyOnWaitlist(
      eventId,
      userId,
    );
    if (isAlreadyOnWaitlist) {
      throw new ConflictException(
        'You are already on the waitlist for this event',
      );
    }

    return this.waitlistRepo.addToWaitlist(eventId, userId);
  }

  async promoteNextUser(eventId: string) {
    const nextUser = await this.waitlistRepo.findNextInWaitlist(eventId);
    if (!nextUser) return null;

    await this.registrationRepo.createRegistration(eventId, nextUser.user_id);

    await this.waitlistRepo.removeFromWaitlist(eventId, nextUser.user_id);

    return nextUser;
  }

  async getUserWaitlist(userId: string) {
    const waitlistEntries = await this.waitlistRepo.findByUserId(userId);
    return waitlistEntries;
  }

  async leaveWaitlist(eventId: string, userId: string) {
    const removed = await this.waitlistRepo.deleteByEventAndUser(
      eventId,
      userId,
    );
    if (!removed) {
      throw new NotFoundException('Waitlist entry not found');
    }
  }
}