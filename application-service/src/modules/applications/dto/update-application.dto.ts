import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApplicationStatus } from '../entities/application.entity';


export class UpdateApplicationDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  jobId!: number;

  
    status!: ApplicationStatus;
}