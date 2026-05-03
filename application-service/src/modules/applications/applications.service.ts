// src/modules/applications/applications.service.ts

import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private repo: Repository<Application>,
    private httpService: HttpService,
  ) {}

  async create(jobId: number, user: any) {
    // 🔥 Only job seekers can apply
    if (user.role !== 'JOB_SEEKER') {
      throw new ForbiddenException('Only job seekers can apply');
    }

    // 🔥 Validate job exists (call Job Service)
    try {
      await firstValueFrom(
        this.httpService.get(`http://localhost:3002/jobs/${jobId}`),
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error';
      throw new BadRequestException(
        `Job with ID ${jobId} does not exist: ${errorMessage}`,
      );
    }

    // 🔥 Prevent duplicate application
    const existing = await this.repo.findOne({
      where: { jobId, userId: user.sub },
    });

    if (existing) {
      throw new BadRequestException('Already applied to this job');
    }

    const application = this.repo.create({
      jobId,
      userId: user.sub,
    });

    return this.repo.save(application);
  }

  async findMyApplications(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
