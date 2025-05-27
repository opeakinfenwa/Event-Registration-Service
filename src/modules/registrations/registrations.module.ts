import { forwardRef, Module } from '@nestjs/common';
import { RegistrationService } from './registrations.service';
import { RegistrationController } from './registrations.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RegistrationRepository } from './registrations.repository';
import { EventsModule } from 'src/modules/events/events.module';
import { WaitlistModule } from 'src/modules/waitlist/waitlist.module';

@Module({
  imports: [DatabaseModule, EventsModule, forwardRef(() => WaitlistModule)],
  providers: [RegistrationService, RegistrationRepository],
  controllers: [RegistrationController],
  exports: [RegistrationRepository],
})
export class RegistrationsModule {}