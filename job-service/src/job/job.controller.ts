import { Controller, Get, Head, Param } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) {} 
    @Get()
    getJobs() {
        return this.jobService.findAll();
    }
    
    @Get(':id')
    getJobById(@Param('id') id: string) {
        // Implement logic to get a job by ID
        return this.jobService.findById(id);
    }
}
