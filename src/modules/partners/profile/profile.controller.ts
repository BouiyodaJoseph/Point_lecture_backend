import { Controller, Get, Body, Put, UseGuards, ValidationPipe, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from '../../auth/decorators/user.decorator';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { UserResponseDto } from '../../admin/dto/user.response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('/api/v1/partner/profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ROLE_PARTNER', 'ROLE_ADMIN') // Accessible aux partenaires ET aux admins
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Helper pour mapper l'entité User vers le DTO de réponse
  private mapToResponseDto(user: any): UserResponseDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
  }

  @Get('me')
  async getMyProfile(@GetUser() user: JwtPayload): Promise<UserResponseDto> {
    const userEntity = await this.profileService.findOne(user.sub);
    return this.mapToResponseDto(userEntity);
  }

  @Put('me')
  async updateMyProfile(
    @GetUser() user: JwtPayload,
    @Body(new ValidationPipe()) updateProfileDto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.profileService.update(user.sub, updateProfileDto);
    return this.mapToResponseDto(updatedUser);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @GetUser() user: JwtPayload,
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.profileService.changePassword(user.sub, changePasswordDto);
    return { message: 'Mot de passe mis à jour avec succès.' };
  }
}