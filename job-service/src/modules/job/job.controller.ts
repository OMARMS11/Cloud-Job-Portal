// src/modules/jobs/jobs.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JobsService } from './job.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createJob')
  create(@Body() dto: CreateJobDto, @Request() req) {
    const user = req.user;

    // 🔥 Role Check
    if (user.role !== 'EMPLOYER') {
      throw new ForbiddenException('Only employers can create jobs');
    }

    return this.jobsService.create(
      dto.title,
      dto.description,
      dto.companyName,
      user.sub
    );
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }
}
