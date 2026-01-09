  import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
  import { OrdersService } from './orders.service';
  import { CreateOrderDto } from './dto/create-order.dto';

  @Controller('orders')
  export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
      return this.ordersService.create(createOrderDto);
    }

    @Get()
    findAll() {
      return this.ordersService.findAll();
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
      return this.ordersService.findByUser(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.ordersService.findOne(id);
    }

    @Patch(':id')
    updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
      return this.ordersService.updateStatus(id, body.status);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.ordersService.remove(id);
    }
  }