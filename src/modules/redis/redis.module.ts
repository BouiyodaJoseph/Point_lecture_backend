import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisProvider } from './redis.provider';

@Global()
@Module({
  /**
   * On importe ConfigModule ici pour garantir que ConfigService
   * sera disponible à l'injection pour les providers de CE module
   * (notamment notre redisProvider).
   */
  imports: [ConfigModule],
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisClientModule {}