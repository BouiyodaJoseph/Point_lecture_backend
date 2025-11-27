import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Cette méthode sera automatiquement appelée par NestJS au démarrage de l'application
  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@ekiosque.com';
    const adminExists = await this.userRepository.findOneBy({ email: adminEmail });

    if (adminExists) {
      this.logger.log('Utilisateur Admin déjà existant. Rien à faire.');
      return;
    }

    this.logger.log('Utilisateur Admin non trouvé. Création en cours...');
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = this.userRepository.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'ROLE_ADMIN',
    });

    await this.userRepository.save(adminUser);
    this.logger.log('Utilisateur Admin créé avec succès.');
  }
}