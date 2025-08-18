import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ClientsService', () => {
  let service: ClientsService;
  let usersService: UsersService;

  const mockClient = {
    id: 1,
    name: 'João',
  };

  const mockUser = {
    id: 1,
    email: 'joao@exemplo.com',
    password: 'senha123',
    name: 'João',
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockClient),
    findOne: jest.fn().mockResolvedValue(mockClient),
    find: jest.fn().mockResolvedValue([mockClient]),
    findOneBy: jest.fn().mockResolvedValue(mockClient),
    save: jest.fn().mockResolvedValue(mockClient),
    remove: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(mockClient),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockRepo,
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    describe('quando o e-mail não existe', () => {
      it('deve criar um novo cliente', async () => {
        (usersService.create as jest.Mock).mockResolvedValue(mockUser);

        const dto = {
          name: 'João',
          email: 'joao@exemplo.com',
          password: 'senha123',
        };

        expect(await service.create(dto)).toEqual(mockClient);
        expect(mockRepo.create).toHaveBeenCalledWith({
          ...dto,
          userId: mockUser.id,
        });
      });
    });

    describe('quando o e-mail já existe', () => {
      it('deve lançar uma exceção se o cliente já existir', async () => {
        const conflictError = new ConflictException('E-mail já cadastrado.');
        (usersService.create as jest.Mock).mockRejectedValue(conflictError);

        const dto = {
          name: 'João',
          email: 'joao@exemplo.com',
          password: 'senha123',
        };

        await expect(service.create(dto)).rejects.toThrow(conflictError);
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os clientes', async () => {
      expect(await service.findAll()).toEqual([mockClient]);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um cliente pelo ID', async () => {
      expect(await service.findOne(1)).toEqual(mockClient);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('deve lançar uma exceção se o cliente não for encontrado', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um cliente existente', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockClient);
      const dto = {
        name: 'João Atualizado',
        email: 'joaoatualizado@exemplo.com',
      };
      expect(await service.update(1, dto)).toEqual(mockClient);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve lançar uma exceção se o cliente não for encontrado', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover um cliente existente', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockClient);

      await service.remove(1);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.remove).toHaveBeenCalledWith(mockClient);
    });

    it('deve lançar uma exceção se o cliente não for encontrado', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
