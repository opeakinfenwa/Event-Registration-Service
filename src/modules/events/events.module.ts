import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EventRepository } from './events.repository';

@Module({
  imports: [DatabaseModule],
  providers: [EventService, EventRepository],
  controllers: [EventController],
  exports: [EventRepository],
})
export class EventsModule {}