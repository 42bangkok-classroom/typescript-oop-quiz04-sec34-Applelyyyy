import { Controller, Get, Param, Query, Post, Body, Delete } from '@nestjs/common';
import { MissionService } from './mission.service';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  /**
   * GET /missions
   * ดึงข้อมูลภารกิจทั้งหมดพร้อมคำนวณระยะเวลา
   */
  @Get()
  findAll() {
    return this.missionService.findAll();
  }

  /**
   * GET /missions/summary
   * แสดงผลรวมจำนวนภารกิจแยกตามสถานะ
   */
  @Get('summary')
  getSummary() {
    return this.missionService.getSummary();
  }

  /**
   * GET /missions/:id
   * ดึงข้อมูลภารกิจ 1 รายการพร้อมเซ็นเซอร์ข้อมูลตามระดับสิทธิ์
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Query('clearance') clearance?: string) {
    return this.missionService.findOne(id, clearance);
  }

  /**
   * POST /missions
   * สร้างภารกิจใหม่และบันทึกลงไฟล์
   */
  @Post()
  create(@Body() body: any) {
    return this.missionService.create(body);
  }

  /**
   * DELETE /missions/:id
   * ลบภารกิจตาม ID
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.remove(id);
  }
}
