import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';
import { IS_PUBLIC_KEY } from './public.decorator';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  interface MockUser {
    id: string;
    email: string;
    roles: string[];
  }

  const mockRequest: { headers: { authorization?: string }; user?: MockUser } =
    {
      headers: {},
      user: undefined,
    };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockUsersService = {
    findOneByIdWithRoles: jest.fn(),
  };

  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  };

  const mockHttpContext = {
    getRequest: jest.fn(() => mockRequest),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);

    mockExecutionContext.switchToHttp.mockReturnValue(mockHttpContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockRequest.headers = {};
    mockRequest.user = undefined;
  });

  it('deve estar definido', () => {
    expect(guard).toBeDefined();
  });

  it('deve retornar verdadeiro para rotas públicas', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(true);

    const result = await guard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toBe(true);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
      IS_PUBLIC_KEY,
      [mockExecutionContext.getHandler(), mockExecutionContext.getClass()],
    );
  });

  it('deve lançar UnauthorizedException quando o cabeçalho de autorização estiver faltando', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);

    await expect(
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException quando o token estiver faltando no cabeçalho de autorização', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockRequest.headers.authorization = 'Bearer';

    await expect(
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException quando a verificação do JWT falhar', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockRequest.headers.authorization = 'Bearer invalid-token';
    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException quando o usuário não for encontrado', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockRequest.headers.authorization = 'Bearer valid-token';
    mockJwtService.verifyAsync.mockResolvedValue({ sub: 1 });
    mockUsersService.findOneByIdWithRoles.mockResolvedValue(null);

    await expect(
      guard.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve retornar verdadeiro e definir o usuário na solicitação quando a autenticação for bem-sucedida', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      roles: [{ role: { name: 'admin' } }, { role: { name: 'user' } }],
    };

    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockRequest.headers.authorization = 'Bearer valid-token';
    mockJwtService.verifyAsync.mockResolvedValue({ sub: 1 });
    mockUsersService.findOneByIdWithRoles.mockResolvedValue(mockUser);

    const result = await guard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual({
      ...mockUser,
      roles: ['admin', 'user'],
    });
  });

  it('deve lidar com usuários sem funções', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      roles: null,
    };

    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockRequest.headers.authorization = 'Bearer valid-token';
    mockJwtService.verifyAsync.mockResolvedValue({ sub: 1 });
    mockUsersService.findOneByIdWithRoles.mockResolvedValue(mockUser);

    const result = await guard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toBe(true);
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user!.roles).toEqual([]);
  });

  it('deve filtrar nomes de função indefinidos', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      roles: [
        { role: { name: 'admin' } },
        { role: null },
        { role: { name: 'user' } },
      ],
    };

    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockRequest.headers.authorization = 'Bearer valid-token';
    mockJwtService.verifyAsync.mockResolvedValue({ sub: 1 });
    mockUsersService.findOneByIdWithRoles.mockResolvedValue(mockUser);

    const result = await guard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(result).toBe(true);
    expect(mockRequest.user!.roles).toEqual(['admin', 'user']);
  });
});
