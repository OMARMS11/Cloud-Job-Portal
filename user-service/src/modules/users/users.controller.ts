import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/modules/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; role: UserRole }) {
    return this.usersService.createUser(body.email, body.password, body.role);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.findByEmail(body.email);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

}
