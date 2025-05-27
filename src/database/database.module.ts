import {
  Module,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Pool } from 'pg';
import { LoggerModule } from '../logger/logger.module';
import databaseConfig from './database.config';

@Module({
  imports: [LoggerModule, ConfigModule.forFeature(databaseConfig)],
  providers: [
    {
      provide: 'PG_CONNECTION',
      useFactory: async (configService: ConfigService, logger: Logger) => {
        const dbConfig = configService.get('database');

        const pool = new Pool({
          connectionString: dbConfig.uri,
          max: dbConfig.maxPoolSize,
          connectionTimeoutMillis: dbConfig.connectTimeoutMS,
        });

        try {
          await pool.connect();
          logger.log('info', 'Connected to PostgreSQL', {
            context: 'DatabaseModule',
          });
        } catch (err) {
          logger.error('Failed to connect to PostgreSQL', {
            context: 'DatabaseModule',
            error: err.stack,
          });
        }

        return pool;
      },
      inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  private isShutdown = false;

  constructor(
    @Inject('PG_CONNECTION') private readonly pool: Pool,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    this.logger.log('info', 'DatabaseModule initialized', {
      context: 'DatabaseModule',
    });
  }

  async onModuleDestroy() {
    await this.shutdown('onModuleDestroy');
  }

  async onApplicationShutdown() {
    await this.shutdown('onApplicationShutdown');
  }

  private async shutdown(context: string) {
    if (this.isShutdown) return;
    this.isShutdown = true;

    this.logger.log('info', `Shutting down PostgreSQL pool via ${context}`, {
      context: 'DatabaseModule',
    });

    await this.pool.end();
  }
}