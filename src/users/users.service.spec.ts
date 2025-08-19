import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: 'joao@exemplo.com',
    password: 'senha123',
    name: 'João',
  };

  const mockRepo: Partial<Record<keyof Repository<User>, jest.Mock>> = {
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      const dto = {
        email: 'joao@exemplo.com',
        password: 'senha123',
        name: 'João',
      };

      mockRepo.findOneBy?.mockResolvedValue(null);

      const result = await service.create(dto);

      expect(result).toEqual(mockUser);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          name: dto.name,
          password: expect.any(String) as unknown as string,
        }),
      );
    });
  });
});
