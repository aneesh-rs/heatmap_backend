import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../schemas/user.schema';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'User statistics' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getUserStats() {
    return this.usersService.getUserStats();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile', type: User })
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Can only access own profile or admin access required',
  })
  async findOne(@Param('id') id: string, @Request() req) {
    // Users can only access their own profile, Admins can access any profile
    if (req.user.role !== 'Admin' && req.user.id !== id) {
      throw new ForbiddenException('You can only access your own profile');
    }
    return this.usersService.findById(id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or email already exists',
  })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or email already exists',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Can only update own profile or admin access required',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Users can only update their own profile, Admins can update any profile
    if (req.user.role !== 'Admin' && req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
