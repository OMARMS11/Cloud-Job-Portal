// src/modules/jobs/jobs.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';

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

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number) {
    const job = await this.repo.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }
}
