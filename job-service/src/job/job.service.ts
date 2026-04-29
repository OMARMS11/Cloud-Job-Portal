import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Job } from 'src/entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobService {
    
    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>) {}

    async createJob(title: string, description: string, companyName: string, createdAt: Date): Promise<Job> {
        const job = this.jobRepository.create({ title, description, companyName, createdAt });
        return this.jobRepository.save(job);
    }

    async findAll(): Promise<Job[]> {
        try {
            return await this.jobRepository.find({ relations: ['creator'] });
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<Job | null> {
        try {
            const job = await this.jobRepository.findOne({ where: { id }, relations: ['creator'] });
            return job;
        } catch (error) {
            console.error('Error finding job by ID:', error);
            throw error;
        }
    }
}
