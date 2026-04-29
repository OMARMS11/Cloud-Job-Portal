import { Controller, Get, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) {}

    @Post()
    createApplication() {
       return this.applicationsService.createApplication(1, 1); // Example: jobId=1, userId=1
        
    }

    @Get()
    getAllApplications() {
        return this.applicationsService.findAll();
    }
}
