import { Module } from '@nestjs/common';
import { MissionController } from './mission/mission.controller';
import { MissionService } from './mission/mission.service';

@Module({
  imports: [],
  controllers: [MissionController],
  providers: [MissionService],
})
export class AppModule {}
