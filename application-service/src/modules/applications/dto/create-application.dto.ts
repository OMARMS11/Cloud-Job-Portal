// src/modules/applications/dto/create-application.dto.ts

import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateApplicationDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  jobId!: number;
}
