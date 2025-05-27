import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './modules/events/events.module';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { AdminModule } from './modules/admin/admin.module';
import { WaitlistModule } from './modules/waitlist/waitlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    EventsModule,
    RegistrationsModule,
    AdminModule,
    WaitlistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}