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
  ) { }

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

    // Convert Mongoose document to plain object
    const userObj = (user as any).toObject ? (user as any).toObject() : user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = userObj;
    return result;
  }

  async login(user: any) {
    // Ensure user object has required fields
    if (!user || !user._id) {
      throw new UnauthorizedException('Invalid user data');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email || '',
      schoolId: user.school_id ? user.school_id.toString() : 'default',
      userGroupId: user.usergroup_id || 'user',
      roles: user.roles || [user.usergroup_id] || ['user'],
    };

    return {
      success: true,
      message: 'Login successful',
      data: {
        access_token: this.jwtService.sign(payload),
        token_type: 'Bearer',
        expires_in: '7d',
        user: {
          id: user._id.toString(),
          name: user.name || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: user.mobile_no || '',
          profile_picture: user.profile_picture || '',
          school_id: user.school_id ? user.school_id.toString() : null,
          usergroup_id: user.usergroup_id || null,
          roles: user.roles || [],
          ref_id: user.ref_id ? user.ref_id.toString() : user._id.toString(),
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

    // Parse name to extract first and last names
    const nameParts = registerDto.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create user
    const user = await this.usersService.create({
      name: registerDto.name,
      first_name: firstName,
      last_name: lastName,
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
        firstname: firstName,
        lastname: lastName,
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

  async updateProfile(userId: string, profileData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    profile_picture?: string;
  }) {
    try {
      const user = await this.usersService.findById(userId);
      
      // Prepare updates for User model
      const userUpdateData: any = {};
      
      if (profileData.first_name !== undefined) {
        userUpdateData.first_name = profileData.first_name;
      }
      
      if (profileData.last_name !== undefined) {
        userUpdateData.last_name = profileData.last_name;
      }
      
      if (profileData.phone !== undefined) {
        userUpdateData.mobile_no = profileData.phone;
      }
      
      if (profileData.profile_picture !== undefined) {
        userUpdateData.profile_picture = profileData.profile_picture;
      }
      
      // Update name field if first_name or last_name changed
      if (profileData.first_name || profileData.last_name) {
        const firstName = profileData.first_name || user.first_name;
        const lastName = profileData.last_name || user.last_name;
        userUpdateData.name = `${firstName} ${lastName}`.trim();
      }

      // Update User model
      const updatedUser = await this.usersService.update(userId, userUpdateData);
      
      // Prepare updates for UserProfile model (if needed)
      const profileUpdateData: any = {};
      
      if (profileData.first_name !== undefined) {
        profileUpdateData.firstname = profileData.first_name;
      }
      
      if (profileData.last_name !== undefined) {
        profileUpdateData.lastname = profileData.last_name;
      }
      
      if (profileData.profile_picture !== undefined) {
        profileUpdateData.profile_picture = profileData.profile_picture;
      }
      
      // Update UserProfile if there are profile-specific updates
      if (Object.keys(profileUpdateData).length > 0) {
        try {
          await this.usersService.updateProfile(userId, profileUpdateData);
        } catch (error) {
          console.log('Profile update failed (may not exist):', error.message);
          // Continue even if profile update fails
        }
      }
      
      return {
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedUser._id,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          name: updatedUser.name,
          phone: updatedUser.mobile_no,
          profile_picture: updatedUser.profile_picture,
          email: updatedUser.email,
        }
      };
    } catch (error) {
      throw error;
    }
  }
}
