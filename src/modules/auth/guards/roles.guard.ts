import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Si aucun rôle n'est requis, on autorise
    }
    const { user } = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    
    // Vérifie si le rôle de l'utilisateur est inclus dans les rôles requis
    return requiredRoles.some((role) => user.role === role);
  }
}