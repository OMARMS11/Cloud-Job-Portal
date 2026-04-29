import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Application } from 'src/entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>) {}

    async createApplication(jobId: number, userId: number): Promise<Application> {
        const application = this.applicationRepository.create({ jobId, userId });
        return this.applicationRepository.save(application);
    }

    async findAll(): Promise<Application[]> {
        try {
            return await this.applicationRepository.find();
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }

    async findById(id: number): Promise<Application | null> {
        try {
            const application = await this.applicationRepository.findOne({ where: { id } });
            return application;
        } catch (error) {
            console.error('Error finding application by ID:', error);
            throw error;
        }
    }
}
