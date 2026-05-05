import { IsOptional, IsString,  MinLength } from 'class-validator';

export class UpdateJobDto {
   @IsOptional()
  @IsString()
  @MinLength(3)
  title!: string;

@IsOptional()
  @IsString()
  @MinLength(10)
  description!: string;
@IsOptional()
  @IsString()
  companyName!: string;
}