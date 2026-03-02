import { Injectable, NotFoundException } from '@nestjs/common';
import { IMission, ICreateMission } from './mission.interface';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class MissionService {
  private filePath = path.join(__dirname, '../../data/missions.json');
  private readonly missions = [
    { id: 1, codename: 'OPERATION_STORM', status: 'ACTIVE' },
    { id: 2, codename: 'SILENT_SNAKE', status: 'COMPLETED' },
    { id: 3, codename: 'RED_DAWN', status: 'FAILED' },
    { id: 4, codename: 'BLACKOUT', status: 'ACTIVE' },
    { id: 5, codename: 'ECHO_FALLS', status: 'COMPLETED' },
    { id: 6, codename: 'GHOST_RIDER', status: 'COMPLETED' },
  ];

  getSummary() {
    const summary: { [key: string]: number } = {};

    for (const mission of this.missions) {
      if (summary[mission.status] == null) {
        summary[mission.status] = 0;
      }
      summary[mission.status]++;
    }

    return summary;
  }
  findAll() {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    const missions = JSON.parse(data) as IMission[];

    return missions.map((mission) => {
      let durationDays = -1;

      if (mission.endDate != null) {
        const start = new Date(mission.startDate).getTime();
        const end = new Date(mission.endDate).getTime();
        durationDays = (end - start) / (1000 * 60 * 60 * 24);
      }

      return { ...mission, durationDays };
    });
  }

  create(body: ICreateMission) {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    const missions = JSON.parse(data) as IMission[];

    const lastId = Number(missions[missions.length - 1].id);
    const newMission: IMission = {
      id: String(lastId + 1),
      codename: body.codename,
      status: 'ACTIVE',
      targetName: body.targetName,
      riskLevel: body.riskLevel,
      startDate: body.startDate,
      endDate: null,
    };

    missions.push(newMission);
    fs.writeFileSync(this.filePath, JSON.stringify(missions, null, 4));

    return newMission;
  }
  remove(id:string){

  }
}
