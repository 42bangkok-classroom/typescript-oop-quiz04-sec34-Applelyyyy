import { Body, Controller, Get, Post } from '@nestjs/common';
import { MissionService } from './mission.service';
import { ICreateMission } from './mission.interface';

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

  @Post()
  create(@Body() body: ICreateMission) {
    return this.missionService.create(body);
  }
}
