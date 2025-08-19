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
      console.log('AuthGuard: rota pública, liberando acesso.');
      return true;
    }

    console.log('AuthGuard: Checking user authentication...');
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;
    console.log('Authorization header:', authHeader);

    if (!authHeader) {
      console.log('AuthGuard: Authorization header ausente.');
      throw new UnauthorizedException();
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);

    if (!token) {
      console.log('AuthGuard: Token ausente no header.');
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      console.log('Payload decodificado:', payload);

      const user = await this.usersService.findOneByIdWithRoles(payload.sub);
      if (!user) {
        console.log('AuthGuard: Usuário não encontrado.');
        throw new UnauthorizedException();
      }

      // Garante que user.roles seja um array de strings (nomes das roles)
      request.user = {
        ...user,
        roles: user.roles?.map((ur) => ur.role?.name).filter(Boolean) || [],
      };
      console.log(
        'AuthGuard: Usuário autenticado com roles:',
        request.user.roles,
      );
    } catch (err) {
      console.log('AuthGuard: Erro ao autenticar:', err);
      throw new UnauthorizedException();
    }
    return true;
  }
}
