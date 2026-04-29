import { JobService } from './job.service';
export declare class JobController {
    private readonly jobService;
    constructor(jobService: JobService);
    getJobs(): Promise<import("../entities/job.entity").Job[]>;
    getJobById(id: string): Promise<import("../entities/job.entity").Job | null>;
}
