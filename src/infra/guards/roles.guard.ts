import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../shared/decorators/roles.decorator';
import { Authenticated } from '@/presentation/dtos/auth/authenticated.dto';
import { RoleModel } from '@/core/domain/models/role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user: Authenticated = request.user;

    if (!user || !user.roles) {
      return false;
    }

    return this.matchRoles(roles, user.roles);
  }

  private matchRoles(requiredRoles: string[], userRoles: RoleModel): boolean {
    return requiredRoles.includes(userRoles.value);
  }
}
