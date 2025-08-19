import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    roles: string[];
    [key: string]: any;
  };
}
import { IS_PUBLIC_KEY } from './public.decorator';
import { Reflector } from '@nestjs/core';

interface JwtPayload {
  sub: number;
  [key: string]: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.usersService.findOneByIdWithRoles(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      // Garante que user.roles seja um array de strings (nomes das roles)
      request.user = {
        ...user,
        roles: user.roles?.map((ur) => ur.role?.name).filter(Boolean) || [],
      };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
    return true;
  }
}
