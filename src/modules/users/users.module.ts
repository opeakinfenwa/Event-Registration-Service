import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { CommonModule } from 'src/common/common.module';
import { UserRepository } from './user.repository';
import { UserService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, CommonModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UsersModule {}