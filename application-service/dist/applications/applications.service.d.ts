import { Repository } from 'typeorm';
import { Application } from "../entities/application.entity";
export declare class ApplicationsService {
    private readonly applicationRepository;
    constructor(applicationRepository: Repository<Application>);
    createApplication(jobId: number, userId: number): Promise<Application>;
    findAll(): Promise<Application[]>;
    findById(id: number): Promise<Application | null>;
}
