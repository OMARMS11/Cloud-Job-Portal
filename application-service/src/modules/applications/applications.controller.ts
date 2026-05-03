// src/modules/applications/applications.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

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
}
