import { Module } from '@nestjs/common';
import { MySpaceService } from './my-space.service';
import { MySpaceController } from './my-space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment, Subscription])],
  controllers: [MySpaceController],
  providers: [MySpaceService],
})
export class MySpaceModule {}