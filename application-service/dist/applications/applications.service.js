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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const application_entity_1 = require("../entities/application.entity");
const typeorm_decorators_1 = require("@nestjs/typeorm/dist/common/typeorm.decorators");
let ApplicationsService = class ApplicationsService {
    applicationRepository;
    constructor(applicationRepository) {
        this.applicationRepository = applicationRepository;
    }
    async createApplication(jobId, userId) {
        const application = this.applicationRepository.create({ jobId, userId });
        return this.applicationRepository.save(application);
    }
    async findAll() {
        try {
            return await this.applicationRepository.find();
        }
        catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const application = await this.applicationRepository.findOne({ where: { id } });
            return application;
        }
        catch (error) {
            console.error('Error finding application by ID:', error);
            throw error;
        }
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_decorators_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map