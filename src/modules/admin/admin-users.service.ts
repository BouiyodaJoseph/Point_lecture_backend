import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user.response.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Méthode de mapping privée et réutilisable
  private mapUserToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    return this.mapUserToResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map(this.mapUserToResponseDto);
  }

  // =======================================================
  // ==                NOUVELLE MÉTHODE OPTIMISÉE         ==
  // =======================================================
  /**
   * Retourne uniquement les utilisateurs ayant le rôle 'ROLE_PARTNER'.
   * @returns Une liste de DTOs d'utilisateurs partenaires.
   */
  async findAllPartners(): Promise<UserResponseDto[]> {
    const partners = await this.userRepository.find({
      where: { role: 'ROLE_PARTNER' },
    });
    return partners.map(this.mapUserToResponseDto);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Utilisateur non trouvé avec l'ID: ${id}`);
    }
    return this.mapUserToResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`Utilisateur non trouvé avec l'ID: ${id}`);
    }

    if (updateUserDto.email) {
        const existingUser = await this.userRepository.findOneBy({ email: updateUserDto.email });
        if (existingUser && existingUser.id !== id) {
            throw new ConflictException('Cet email est déjà utilisé par un autre compte.');
        }
    }

    const updatedUser = await this.userRepository.save(user);
    return this.mapUserToResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur non trouvé avec l'ID: ${id}`);
    }
  }
}