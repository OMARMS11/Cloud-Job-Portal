import { Body, Controller, Get, Head, Param, Post } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('jobs')
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
    
    @Post('create')
    createJob(@Body() body: { title: string; description: string; companyName: string }) {
        const { title, description, companyName } = body;
        return this.jobService.createJob(title, description, companyName, new Date());
    }
}
