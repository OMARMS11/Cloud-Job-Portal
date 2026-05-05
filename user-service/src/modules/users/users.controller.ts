import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/modules/entities/user.entity';
import { JwtAuthGuard } from '../auth/gaurds/jwt.gaurd';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


}
