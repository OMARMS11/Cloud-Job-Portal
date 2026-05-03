import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Application]), HttpModule],
  providers: [ApplicationsService, JwtStrategy],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
