import { Module } from '@nestjs/common';
import { JobsService } from './job.service';
import { JobsController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/modules/entities/job.entity';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  providers: [JobsService, JwtStrategy],
  controllers: [JobsController],
})
export class JobModule {}
