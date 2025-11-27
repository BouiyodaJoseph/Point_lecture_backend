import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@Controller('/api/v1/partner/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de connexion pour les utilisateurs.
   * Il est marqué comme @Public() pour être exempté d'une protection globale.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK) // Par convention, un login réussi retourne un statut 200 OK.
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    // 1. Valider que l'email et le mot de passe sont corrects
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // 2. Si la validation échoue, lancer une erreur 401
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // 3. Si la validation réussit, générer et retourner le token JWT
    return this.authService.login(user);
  }
}