// src/modules/jobs/jobs.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private repo: Repository<Job>,
  ) {}

  create(
    title: string,
    description: string,
    companyName: string,
    createdBy: string,
  ) {
    const job = this.repo.create({
      title,
      description,
      companyName,
      createdBy,
    });
    return this.repo.save(job);
  }

  findAll(createdBy?: string) {
    if (createdBy) {
      return this.repo.find({ where: { createdBy }, order: { createdAt: 'DESC' } });
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number) {
    const job = await this.repo.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async update(
    id: number,
    dto: Partial<UpdateJobDto>
  ) {
    try{
      const job = await this.findById(id);
      if (dto.title) job.title = dto.title;
      if (dto.description) job.description = dto.description;
      if (dto.companyName) job.companyName = dto.companyName;
      return this.repo.save(job);
    }
    catch(error){
      console.error('Error updating job:', error);
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const job = await this.findById(id);
      return this.repo.remove(job);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  } 
}


