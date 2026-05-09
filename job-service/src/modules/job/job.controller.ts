// src/modules/jobs/jobs.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { JobsService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { find } from 'rxjs';
import { UpdateJobDto } from './dto/update-job.dto';

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
      user.sub,
    );
  }

  @Get()
  findAll(@Query('employerId') employerId?: string) {
    return this.jobsService.findAll(employerId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<UpdateJobDto>,
    @Request() req,
  ) {
    const user = req.user;  
    const job = await this.jobsService.findById(id);

    // 🔥 Ownership Check
    if (job.createdBy !== user.sub) {
      throw new ForbiddenException('You can only update your own jobs');
    }
    return this.jobsService.update(id, dto);
  }
}
