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
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
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
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.delete(id);
  }

  // for the Employer
  @UseGuards(JwtAuthGuard)
  @Patch(':id/updateStatus')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: ApplicationStatus,
    @Request() req,
  ) {
    return this.applicationsService.updateStatus(id, status, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('employer')
  getEmployerApplications(@Request() req) {
    return this.applicationsService.findApplicationsForEmployer(req.user.sub);
  }

}
