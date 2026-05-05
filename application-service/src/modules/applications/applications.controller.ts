// src/modules/applications/applications.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { App } from 'supertest/types';
import { ApplicationStatus } from './entities/application.entity';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateApplicationDto, @Request() req) {
    return this.applicationsService.create(dto.jobId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyApplications(@Request() req) {
    return this.applicationsService.findMyApplications(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/delete')
  delete(@Request() req, @Body('id') id: number) {
    return this.applicationsService.delete(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/updateStatus')
  updateStatus(@Request() req, @Body('id') id: number, @Body('status') status: ApplicationStatus) {
    return this.applicationsService.updateStatus(id, status, req.user);
  }


}
