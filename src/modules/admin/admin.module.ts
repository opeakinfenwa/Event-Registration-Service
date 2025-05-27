import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EventsModule } from 'src/modules/events/events.module';
import { RegistrationsModule } from 'src/modules/registrations/registrations.module';
import { WaitlistModule } from 'src/modules/waitlist/waitlist.module';

@Module({
  imports: [DatabaseModule, EventsModule, RegistrationsModule, WaitlistModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}