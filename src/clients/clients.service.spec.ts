import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClientsService', () => {
  let service: ClientsService;

  const mockClient = { id: 1, name: 'João', email: 'joao@exemplo.com' };

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
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo cliente', async () => {
      mockRepo.findOne.mockResolvedValue(null); // Simula que o cliente não existe
      mockRepo.create.mockReturnValue(mockClient);
      mockRepo.save.mockResolvedValue(mockClient);

      const dto = { name: 'João', email: 'joao@exemplo.com' };

      expect(await service.create(dto)).toEqual(mockClient);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(mockClient);
    });

    it('deve lançar uma exceção se o cliente já existir', async () => {
      mockRepo.findOne.mockResolvedValue(mockClient); // já existe

      const dto = { name: 'João', email: 'joao@exemplo.com' };

      await expect(service.create(dto)).rejects.toThrow(
        new Error('E-mail já cadastrado.'),
      );
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
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

      await expect(service.findOne(1)).rejects.toThrow(
        new Error('Cliente não encontrado'),
      );
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

      await expect(service.update(1, {})).rejects.toThrow(
        new Error('Cliente não encontrado'),
      );
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

      await expect(service.remove(1)).rejects.toThrow(
        new Error('Cliente não encontrado'),
      );
    });
  });
});
