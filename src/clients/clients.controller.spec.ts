import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

describe('ClientsController', () => {
  let controller: ClientsController;

  const mockClient = { id: 1, name: 'João', email: 'joao@exemplo.com' };

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

  it('deve criar um cliente', async () => {
    const dto: CreateClientDto = {
      name: 'João',
      email: 'joao@exemplo.com',
    };
    expect(await controller.create(dto)).toEqual(mockClient);
    expect(mockClientsService.create).toHaveBeenCalledWith(dto);
  });
});
