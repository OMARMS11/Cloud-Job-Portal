import { Job } from "../entities/job.entity";
import { Repository } from 'typeorm';
export declare class JobService {
    private readonly jobRepository;
    constructor(jobRepository: Repository<Job>);
    createJob(title: string, description: string, companyName: string, createdAt: Date): Promise<Job>;
    findAll(): Promise<Job[]>;
    findById(id: string): Promise<Job | null>;
}
