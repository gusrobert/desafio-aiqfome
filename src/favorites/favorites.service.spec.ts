import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { ProductsService } from 'src/products/products.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const mockFavorite = {
    id: 1,
    clientId: 1,
    productId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct = {
    id: 1,
    title: 'Product 1',
    price: 100,
    description: 'Description 1',
    category: 'Category 1',
    image: 'image1.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockFavorite),
    findOne: jest.fn().mockResolvedValue(mockFavorite),
    find: jest.fn().mockResolvedValue([mockFavorite]),
    save: jest.fn().mockResolvedValue(mockFavorite),
    remove: jest.fn().mockResolvedValue(mockFavorite),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: mockRepo,
        },
        {
          provide: ProductsService,
          useValue: { mockProduct },
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo favorito', async () => {
      mockRepo.findOne.mockResolvedValue(null); // Simula que o favorito não existe
      mockRepo.save.mockResolvedValue(mockRepo.create());

      const dto = { clientId: 1, productId: 1 };

      expect(await service.create(dto)).toEqual(mockFavorite);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { clientId: dto.clientId, productId: dto.productId },
      });
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(mockFavorite);
    });

    it('deve lançar uma exceção se o favorito já existir', async () => {
      mockRepo.findOne.mockResolvedValue(mockRepo.create());

      const dto = { clientId: 1, productId: 2 };

      await expect(service.create(dto)).rejects.toThrow(
        new Error('Favorito já cadastrado.'),
      );
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { clientId: dto.clientId, productId: dto.productId },
      });
    });
  });
});
