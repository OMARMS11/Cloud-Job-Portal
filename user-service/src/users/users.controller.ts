import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() body: { email: string; password: string; role: UserRole }) {
        this.usersService.createUser(body.email, body.password, body.role);
  }

  @Post()
  login(@Body() body: { email: string; password: string }) {
    // Implement login logic here (e.g., validate credentials, generate JWT)
    console.log('Login attempt:', body);
  }

}
