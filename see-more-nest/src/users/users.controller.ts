  import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { AddFundsDto } from './dto/add-funds.dto';
  import { ChangePasswordDto } from './dto/change-password.dto';

  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
      return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.usersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.usersService.remove(id);
    }

    @Post(':id/add-funds')
    addFunds(@Param('id') id: string, @Body() addFundsDto: AddFundsDto) {
      return this.usersService.addFunds(id, addFundsDto);
    }

    @Post(':id/change-password')
    changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
      return this.usersService.changePassword(id, changePasswordDto);
    }
  }