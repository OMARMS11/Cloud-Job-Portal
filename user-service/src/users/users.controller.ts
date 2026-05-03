import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; role: UserRole }) {
    this.usersService.createUser(body.email, body.password, body.role);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    // Implement login logic here (e.g., validate credentials, generate JWT)
    console.log('Login attempt:', body);
  }

  @Get('users')
  getAllUsers() {
    console.log('Fetching all users');
  }
}
