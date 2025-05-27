import { forwardRef, Module } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { WaitlistController } from './waitlist.controller';
import { WaitlistRepository } from './waitlist.repository';
import { EventsModule } from 'src/modules/events/events.module';
import { RegistrationsModule } from 'src/modules/registrations/registrations.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    EventsModule,
    forwardRef(() => RegistrationsModule),
  ],
  providers: [WaitlistService, WaitlistRepository],
  controllers: [WaitlistController],
  exports: [WaitlistRepository, WaitlistService],
})
export class WaitlistModule {}
