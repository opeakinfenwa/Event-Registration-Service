import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './events.repository';
import { CreateEventDto } from './dtos/createEvent.dto';
import { UpdateEventDto } from './dtos/updateEvent.dto';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(userId: string, createEventDto: CreateEventDto) {
    return this.eventRepository.createEvent(userId, createEventDto);
  }

  async getAllEvents() {
    return this.eventRepository.findAllEvents();
  }

  async getEventById(id: string) {
    const event = await this.eventRepository.findEventById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findEventsByUser(userId: string) {
    return this.eventRepository.findEventsByUser(userId);
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    const existing = await this.eventRepository.findEventById(id);
    if (!existing) {
      throw new NotFoundException(
        `Cannot update: Event with ID ${id} not found`,
      );
    }

    return this.eventRepository.updateEvent(id, updateEventDto);
  }

  async deleteEvent(id: string) {
    const existing = await this.eventRepository.findEventById(id);
    if (!existing) {
      throw new NotFoundException(
        `Cannot delete: Event with ID ${id} not found`,
      );
    }

    return this.eventRepository.deleteEvent(id);
  }
}