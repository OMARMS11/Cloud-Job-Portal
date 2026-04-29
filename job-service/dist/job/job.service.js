"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_decorators_1 = require("@nestjs/typeorm/dist/common/typeorm.decorators");
const job_entity_1 = require("../entities/job.entity");
const typeorm_1 = require("typeorm");
let JobService = class JobService {
    jobRepository;
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    async createJob(title, description, companyName, createdAt) {
        const job = this.jobRepository.create({ title, description, companyName, createdAt });
        return this.jobRepository.save(job);
    }
    async findAll() {
        try {
            return await this.jobRepository.find({ relations: ['creator'] });
        }
        catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const job = await this.jobRepository.findOne({ where: { id }, relations: ['creator'] });
            return job;
        }
        catch (error) {
            console.error('Error finding job by ID:', error);
            throw error;
        }
    }
};
exports.JobService = JobService;
exports.JobService = JobService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_decorators_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], JobService);
//# sourceMappingURL=job.service.js.map