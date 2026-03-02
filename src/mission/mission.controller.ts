import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string, @Query('clearance') clearance: string = 'STANDARD') {
    return this.missionService.findOne(id, clearance);
  }

  @Post()
  create(@Body() body: ICreateMission) {
    return this.missionService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.remove(id);
  }
}
