import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

    async createUser(email: string, password: string, role: UserRole): Promise<User> {
    const user = this.userRepository.create({ email, password, role });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    try{
        return await this.userRepository.find();
    }
    catch(error){
        console.error('Error fetching users:', error);
        throw error;
    }
  }

    async findByEmail(email: string): Promise<User | null> {
        try{
            const user = await this.userRepository.findOne({ where: { email } });
            return user;
        }
        catch(error){
            console.error('Error finding user by email:', error);
            throw error;
        }
    
  }
  async findById(id: string): Promise<User | null> {
    try{
        const user = await this.userRepository.findOne({ where: { id } });
        return user;
    }
    catch(error){
        console.error('Error finding user by ID:', error);
        throw error;
    }
  }

}
