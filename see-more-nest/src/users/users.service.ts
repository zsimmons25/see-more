  import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { AddFundsDto } from './dto/add-funds.dto';
  import { ChangePasswordDto } from './dto/change-password.dto';
  import { User } from './entities/user.entity';

  @Injectable()
  export class UsersService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
    ) {}

    create(createUserDto: CreateUserDto): Promise<User> {
      const user = this.usersRepository.create(createUserDto);
      return this.usersRepository.save(user);
    }

    findAll(): Promise<User[]> {
      return this.usersRepository.find();
    }

    async findOne(id: string): Promise<User> {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
      await this.usersRepository.update(id, updateUserDto);
      return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
      await this.usersRepository.delete(id);
    }

    async addFunds(id: string, addFundsDto: AddFundsDto): Promise<User> {
      const user = await this.findOne(id);
      user.balance = Number(user.balance) + Number(addFundsDto.amount);
      return this.usersRepository.save(user);
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
      const user = await this.findOne(id);

      const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
      user.password = hashedPassword;
      await this.usersRepository.save(user);

      return { message: 'Password changed successfully' };
    }
  }