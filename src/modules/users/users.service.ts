import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmailWithPassword(email: string): Promise<User | null> {
    // Le QueryBuilder est la méthode la plus robuste pour outrepasser `select: false`.
    return this.userRepository
      .createQueryBuilder('user') // On donne un alias 'user' à notre table
      .where('user.email = :email', { email }) // On filtre par email
      .addSelect('user.password') // ON FORCE l'ajout de la colonne password à la sélection
      .getOne(); // On exécute et on attend un seul résultat
  }
}