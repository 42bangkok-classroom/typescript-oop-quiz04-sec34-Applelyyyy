import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IMission } from './mission.interface';

@Injectable()
export class MissionService {
  // Mock data ของภารกิจทั้งหมด
  private readonly missions = [
    { id: 1, codename: 'OPERATION_STORM', status: 'ACTIVE' },
    { id: 2, codename: 'SILENT_SNAKE', status: 'COMPLETED' },
    { id: 3, codename: 'RED_DAWN', status: 'FAILED' },
    { id: 4, codename: 'BLACKOUT', status: 'ACTIVE' },
    { id: 5, codename: 'ECHO_FALLS', status: 'COMPLETED' },
    { id: 6, codename: 'GHOST_RIDER', status: 'COMPLETED' },
  ];

  /**
   * สรุปจำนวนภารกิจตามสถานะ
   * @returns Object ที่มี key เป็นชื่อสถานะ และ value เป็นจำนวน
   */
  getSummary() {
    // ใช้ reduce เพื่อนับจำนวนแต่ละสถานะ
    return this.missions.reduce((summary, mission) => {
      // ถ้ายังไม่มี key สถานะนี้ ให้ตั้งเป็น 0 ก่อน
      if (!summary[mission.status]) {
        summary[mission.status] = 0;
      }
      // เพิ่มจำนวนของสถานะนั้น
      summary[mission.status]++;
      return summary;
    }, {});
  }

  /**
   * ดึงข้อมูลภารกิจทั้งหมดจากไฟล์ JSON พร้อมคำนวณระยะเวลา
   * @returns Array ของภารกิจพร้อม field durationDays
   */
  findAll() {
    // อ่านไฟล์ missions.json
    const filePath = path.join(process.cwd(), 'data', 'missions.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(fileContent);

    // Map ข้อมูลเพื่อเพิ่ม durationDays
    return missions.map((mission) => {
      let durationDays = -1;

      // ถ้ามี endDate ให้คำนวณจำนวนวัน
      if (mission.endDate) {
        const start = new Date(mission.startDate);
        const end = new Date(mission.endDate);
        // หาจำนวนวันโดยหาผลต่างของเวลา แล้วหารด้วยจำนวน milliseconds ใน 1 วัน
        durationDays = Math.floor(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );
      }

      return {
        ...mission,
        durationDays,
      };
    });
  }

  /**
   * ดึงข้อมูลภารกิจ 1 รายการตาม ID พร้อมเซ็นเซอร์ข้อมูลตามระดับสิทธิ์
   * @param id รหัสภารกิจ
   * @param clearance ระดับสิทธิ์ (STANDARD, SECRET, TOP_SECRET)
   * @returns ข้อมูลภารกิจที่มีการเซ็นเซอร์ตามสิทธิ์
   */
  findOne(id: string, clearance: string = 'STANDARD') {
    // อ่านไฟล์ missions.json
    const filePath = path.join(process.cwd(), 'data', 'missions.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(fileContent);

    // หาภารกิจที่ตรงกับ id
    const mission = missions.find((m) => m.id === id);

    // ถ้าหาไม่เจอ throw error 404
    if (!mission) {
      throw new NotFoundException();
    }

    // ตรวจสอบว่าต้องเซ็นเซอร์หรือไม่
    // ถ้า riskLevel เป็น HIGH หรือ CRITICAL และ clearance ไม่ใช่ TOP_SECRET
    const needRedaction =
      (mission.riskLevel === 'HIGH' || mission.riskLevel === 'CRITICAL') &&
      clearance !== 'TOP_SECRET';

    // ถ้าต้องเซ็นเซอร์ ให้เปลี่ยน targetName
    if (needRedaction) {
      return {
        ...mission,
        targetName: '***REDACTED***',
      };
    }

    return mission;
  }

  /**
   * สร้างภารกิจใหม่และบันทึกลงไฟล์
   * @param body ข้อมูลภารกิจใหม่
   * @returns ภารกิจที่สร้างเสร็จพร้อม id
   */
  create(body: any) {
    // อ่านไฟล์ missions.json
    const filePath = path.join(process.cwd(), 'data', 'missions.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(fileContent);

    // หา id ใหม่โดยเพิ่มจากรายการสุดท้าย
    const lastId = missions.length > 0 ? parseInt(missions[missions.length - 1].id) : 0;
    const newId = (lastId + 1).toString();

    // สร้างภารกิจใหม่พร้อมค่า default
    const newMission: IMission = {
      id: newId,
      codename: body.codename,
      status: 'ACTIVE', // ตั้งค่า default เป็น ACTIVE
      targetName: body.targetName,
      riskLevel: body.riskLevel,
      startDate: body.startDate,
      endDate: null, // ตั้งค่า default เป็น null
    };

    // เพิ่มภารกิจใหม่เข้า array
    missions.push(newMission);

    // เขียนกลับลงไฟล์
    fs.writeFileSync(filePath, JSON.stringify(missions, null, 2));

    return newMission;
  }

  /**
   * ลบภารกิจตาม ID
   * @param id รหัสภารกิจที่ต้องการลบ
   * @returns ข้อความแจ้งผลสำเร็จ
   */
  remove(id: string) {
    // อ่านไฟล์ missions.json
    const filePath = path.join(process.cwd(), 'data', 'missions.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(fileContent);

    // หาภารกิจที่ตรงกับ id
    const missionIndex = missions.findIndex((m) => m.id === id);

    // ถ้าหาไม่เจอ throw error 404
    if (missionIndex === -1) {
      throw new NotFoundException();
    }

    // ลบภารกิจออกจาก array
    missions.splice(missionIndex, 1);

    // เขียนกลับลงไฟล์
    fs.writeFileSync(filePath, JSON.stringify(missions, null, 2));

    return {
      message: `Mission ID ${id} has been successfully deleted.`,
    };
  }
}
