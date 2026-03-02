import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MissionService } from './mission.service';
import type { ICreateMission } from './mission.interface';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  findAll() {
    return this.missionService.findAll();
  }

  @Get('summary')
  getSummary() {
    return this.missionService.getSummary();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.remove(id);
  }
}
