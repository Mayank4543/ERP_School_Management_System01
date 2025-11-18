import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  schoolId: string;
  userGroupId: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_activated) {
      throw new UnauthorizedException('Account is not activated');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user as any;
    return result;
  }

  async login(user: any) {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      schoolId: user.school_id ? user.school_id.toString() : 'default',
      userGroupId: user.usergroup_id || 'user',
      roles: user.roles || [],
    };

    return {
      success: true,
      message: 'Login successful',
      data: {
        access_token: this.jwtService.sign(payload),
        token_type: 'Bearer',
        expires_in: '7d',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          school_id: user.school_id || null,
          usergroup_id: user.usergroup_id || null,
          roles: user.roles || [],
        },
      },
    };
  }

  async register(registerDto: any) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.usersService.hashPassword(registerDto.password);

    // Get or create school_id
    let schoolId = registerDto.school_id;
    
    if (!schoolId) {
      // If no school_id provided, get the first available school or create a default one
      const schools = await this.usersService.getOrCreateDefaultSchool();
      schoolId = schools._id.toString();
    }

    // Create user
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      school_id: schoolId,
      usergroup_id: registerDto.usergroup_id,
      mobile_no: registerDto.mobile_no || '',
      roles: [registerDto.usergroup_id],
      is_activated: true,
      email_verified: false,
    });

    // Create user profile
    try {
      await this.usersService.createProfile(user._id.toString(), {
        school_id: schoolId,
        firstname: registerDto.name.split(' ')[0],
        lastname: registerDto.name.split(' ').slice(1).join(' ') || '',
        status: 'active',
      });
    } catch (error) {
      console.error('Profile creation failed:', error);
      // Continue even if profile creation fails
    }

    return this.login(user);
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user as any;
    return {
      success: true,
      data: result,
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);

    const isPasswordValid = await this.usersService.comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await this.usersService.hashPassword(newPassword);
    await this.usersService.update(userId, { password: hashedPassword });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
}
