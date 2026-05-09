// src/modules/applications/applications.service.ts

import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
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
        this.httpService.get(`http://${process.env.JOB_SERVICE_HOST || 'localhost:3000'}/jobs/${jobId}`),
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

  async findApplicationsForEmployer(employerId: string) {
    const jobsResponse = await firstValueFrom(
      this.httpService.get(
        `http://${process.env.JOB_SERVICE_HOST || 'localhost:3000'}/jobs`,
        { params: { employerId } },
      ),
    );

    const jobs = jobsResponse.data || [];
    const jobIds = jobs.map((job: any) => job.id).filter(Boolean);

    if (jobIds.length === 0) {
      return [];
    }

    return this.repo.find({
      where: { jobId: In(jobIds) },
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: number) {
    const application = await this.repo.findOne({ where: { id } });
    if (!application) {
      throw new BadRequestException('Application not found');
    }
    return this.repo.remove(application);
  }



  
  async updateStatus(id: number, status: ApplicationStatus, user: any) {
    
    try{
      const application = await this.repo.findOne({ where: { id } }); 
      if(!application){
        throw new BadRequestException('Application not found');
      }
      // 🔥 Only employers can update status
      if (user.role !== 'EMPLOYER') {
        throw new ForbiddenException('Only employers can update application status');
      }
      if (!Object.values(ApplicationStatus).includes(status)) {
        throw new BadRequestException('Invalid status value');
      }

      application.status = status;
      return this.repo.save(application);

    }
   catch(error){
    console.error('Error updating application status:', error);
    throw error;
    }
  }

 
}
