import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(@CurrentUser() user: any, @Query() query: any) {
    return this.usersService.findAll(user.schoolId, query);
  }

  @Post()
  async create(@Body() createUserDto: any, @CurrentUser() currentUser: any) {
    // Set school_id from current user if not provided
    if (!createUserDto.school_id && currentUser.schoolId) {
      createUserDto.school_id = currentUser.schoolId;
    }

    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Post(':id/profile')
  async createProfile(@Param('id') id: string, @Body() profileData: any) {
    const profile = await this.usersService.createProfile(id, profileData);
    return {
      success: true,
      message: 'Profile created successfully',
      data: profile,
    };
  }

  @Put(':id/profile')
  async updateProfile(@Param('id') id: string, @Body() profileData: any) {
    const profile = await this.usersService.updateProfile(id, profileData);
    return {
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    };
  }
}
