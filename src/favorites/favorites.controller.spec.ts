import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  const mockFavorite = {
    id: 1,
    clientId: 1,
    productId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct = [
    {
      id: 1,
      title: 'Produto Teste',
      price: 29.99,
      description: 'Descrição do produto',
      image: 'https://exemplo.com/imagem.jpg',
    },
  ];

  const mockFavoritesService = {
    create: jest.fn().mockResolvedValue(mockFavorite),
    findAll: jest.fn().mockResolvedValue([mockFavorite]),
    findOne: jest.fn().mockResolvedValue(mockFavorite),
    update: jest.fn().mockResolvedValue(mockFavorite),
    remove: jest.fn().mockResolvedValue(undefined),
    getFavoritesByClientId: jest.fn().mockResolvedValue(mockProduct),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um favorito', async () => {
      const dto: CreateFavoriteDto = {
        clientId: 1,
        productId: 2,
      };
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(mockFavorite);
      expect(await controller.create(dto)).toEqual(mockFavorite);
      expect(createSpy).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os favoritos', async () => {
      const result = [mockFavorite];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('deve retornar um favorito', async () => {
      const result = mockFavorite;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('deve atualizar um favorito', async () => {
      const dto: CreateFavoriteDto = {
        clientId: 1,
        productId: 2,
      };
      const updateSpy = jest
        .spyOn(service, 'update')
        .mockResolvedValue(mockFavorite);
      expect(await controller.update('1', dto)).toEqual(mockFavorite);
      expect(updateSpy).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('deve remover um favorito', async () => {
      const removeSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValue(undefined);
      expect(await controller.remove('1')).toEqual(undefined);
      expect(removeSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('getFavoritesByClientId', () => {
    it('deve retornar os favoritos de um cliente', async () => {
      jest
        .spyOn(service, 'getFavoritesByClientId')
        .mockResolvedValue(mockProduct);
      expect(await controller.getFavoritesByClientId('1')).toEqual(mockProduct);
    });
  });
});
