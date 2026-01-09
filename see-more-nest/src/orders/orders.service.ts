  import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { CreateOrderDto } from './dto/create-order.dto';
  import { Order } from './entities/order.entity';
  import { User } from '../users/entities/user.entity';

  @Injectable()
  export class OrdersService {
    constructor(
      @InjectRepository(Order)
      private ordersRepository: Repository<Order>,
      @InjectRepository(User)
      private usersRepository: Repository<User>,
    ) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
      const user = await this.usersRepository.findOneBy({ id: createOrderDto.userId });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.balance < createOrderDto.total) {
        throw new BadRequestException('Insufficient balance');
      }

      user.balance = Number(user.balance) - Number(createOrderDto.total);
      await this.usersRepository.save(user);

      const order = this.ordersRepository.create({
        userId: createOrderDto.userId,
        items: createOrderDto.items,
        total: createOrderDto.total,
        status: 'complete',
      });

      return this.ordersRepository.save(order);
    }

    async findAll(): Promise<Order[]> {
      return this.ordersRepository.find();
    }

    async findByUser(userId: string): Promise<Order[]> {
      return this.ordersRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    }

    async findOne(id: string): Promise<Order> {
      const order = await this.ordersRepository.findOneBy({ id });
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    }

    async updateStatus(id: string, status: string): Promise<Order> {
      const order = await this.findOne(id);
      order.status = status;
      return this.ordersRepository.save(order);
    }

    async remove(id: string): Promise<void> {
      await this.ordersRepository.delete(id);
    }
  }