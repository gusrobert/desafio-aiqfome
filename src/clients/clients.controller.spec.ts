import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

describe('ClientsController', () => {
  let controller: ClientsController;

  const mockClient = {
    id: 1,
    name: 'João',
    email: 'joao@exemplo.com',
    password: 'senha123',
  };

  const mockClientsService = {
    create: jest.fn().mockResolvedValue(mockClient),
    findAll: jest.fn().mockResolvedValue([mockClient]),
    findOne: jest.fn().mockResolvedValue(mockClient),
    update: jest.fn().mockResolvedValue(mockClient),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um cliente', async () => {
      const dto: CreateClientDto = {
        name: 'João',
        email: 'joao@exemplo.com',
        password: 'senha123',
      };
      expect(await controller.create(dto)).toEqual(mockClient);
      expect(mockClientsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os clientes', async () => {
      expect(await controller.findAll()).toEqual([mockClient]);
      expect(mockClientsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um cliente', async () => {
      expect(await controller.findOne('1')).toEqual(mockClient);
      expect(mockClientsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('deve atualizar um cliente', async () => {
      const dto: CreateClientDto = {
        name: 'João',
        email: 'joao@exemplo.com',
        password: 'senha123',
      };

      mockClientsService.update.mockResolvedValue(mockClient);

      expect(await controller.update('1', dto)).toEqual(mockClient);
      expect(mockClientsService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('deve remover um cliente', async () => {
      mockClientsService.remove.mockResolvedValue(undefined);
      expect(await controller.remove('1')).toEqual(undefined);
      expect(mockClientsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
