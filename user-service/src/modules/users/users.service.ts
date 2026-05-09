import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

    async createUser(email: string, password: string, role: UserRole, fullName?: string): Promise<User> {
    const user = this.userRepository.create({ email, password, role, fullName });

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

    async findByEmail(email: string, includePassword = false): Promise<User | null> {
        try{
            const query = this.userRepository.createQueryBuilder('user').where('user.email = :email', { email });

            if (includePassword) {
                query.addSelect('user.password');
            }

            const user = await query.getOne();
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

  async updateUser(id: string, updateData: Partial<UpdateUserDto>): Promise<UpdateUserDto> {
    try{
        await this.userRepository.update({ id }, updateData);
        const updatedUser = await this.userRepository.findOne({ where: { id } });

        if (!updatedUser) {
            throw new Error(`User with id ${id} not found`);
        }

        return updatedUser;
    }
    catch(error){
        console.error('Error updating user:', error);
        throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try{
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new Error(`User with id ${id} not found`);
        }
    }
    catch(error){
        console.error('Error deleting user:', error);
        throw error;
    }
  }

}
