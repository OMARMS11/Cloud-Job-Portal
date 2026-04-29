import { ApplicationsService } from './applications.service';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    createApplication(): Promise<import("../entities/application.entity").Application>;
    getAllApplications(): Promise<import("../entities/application.entity").Application[]>;
}
