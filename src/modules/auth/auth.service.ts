import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Vérifie si l'email et le mot de passe correspondent à un utilisateur.
   * Si oui, retourne l'objet utilisateur (sans le mot de passe).
   * Sinon, retourne null.
   * @param email L'email de l'utilisateur.
   * @param pass Le mot de passe en clair.
   * @returns L'objet utilisateur ou null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmailWithPassword(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // La comparaison a réussi, on retourne l'utilisateur sans son mot de passe haché.
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * Génère un token JWT signé pour un utilisateur donné.
   * @param user L'objet utilisateur (doit contenir id, name, role, email).
   * @returns Un objet contenant le token.
   */
  async login(user: any): Promise<{ token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}