import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/createuser.dtos';
import { UpdateUserDto } from './dtos/updateUser.dtos';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guards';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { AuthRequest } from 'src/common/interfaces/authRequest.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.signupUser(createUserDto);
    return {
      message: 'User registered successfully',
      data: newUser,
    };
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthRequest,
  ) {
    const requester = req.user;
    if (requester.id !== id) {
      throw new ForbiddenException('You are not allowed to update this user');
    }
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return {
      message: 'User successfully updated',
      data: updatedUser,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string, @Req() req: AuthRequest) {
    const requester = req.user;
    if (requester.id !== id) {
      throw new ForbiddenException('You are not allowed to delete this user');
    }
    const result = await this.userService.deleteUser(id);
    return {
      message: 'User successfully deleted',
      data: result,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: AuthRequest) {
    const userId = req.user.id;
    const user = await this.userService.getUserById(userId);
    return {
      message: 'User fetched successfully',
      data: user,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return {
      message: 'User fetched successfully',
      data: user,
    };
  }
}