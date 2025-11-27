import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.preload({ id, ...updateProfileDto });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return this.userRepository.save(user);
  }
  
  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'password'] // On doit sélectionner le mot de passe explicitement
    });
    
    if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
    }

    const isPasswordMatching = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('L\'ancien mot de passe est incorrect.');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.update(id, { password: hashedPassword });
  }
}