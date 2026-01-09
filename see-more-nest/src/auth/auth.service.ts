  import { Injectable, UnauthorizedException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { User } from '../users/entities/user.entity';
  import { LoginDto } from './dto/login.dto';
  import { RegisterDto } from './dto/register.dto';

  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
      const user = await this.usersRepository.findOne({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: user.balance,
        },
        token,
      };
    }

    async register(registerDto: RegisterDto) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new UnauthorizedException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = this.usersRepository.create({
        ...registerDto,
        password: hashedPassword,
        balance: 100000,
      });

      await this.usersRepository.save(user);

      const payload = { sub: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: user.balance,
        },
        token,
      };
    }
  }