import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- NOUVEL IMPORT
import { redisProvider } from './redis.provider';

@Global()
@Module({
  // =======================================================
  // ==                 CORRECTION ICI                    ==
  // =======================================================
  // On doit importer ConfigModule pour que les providers de ce module
  // (ici, notre redisProvider) puissent injecter ConfigService.
  imports: [ConfigModule],
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisClientModule {}