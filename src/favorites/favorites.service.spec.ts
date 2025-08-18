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
    category: 'Category 1',
    createdAt: new Date(),
    description: 'Description 1',
    id: 1,
    image: 'image1.jpg',
    price: 100,
    title: 'Product 1',
    updatedAt: new Date(),
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockFavorite),
    findOne: jest.fn().mockResolvedValue(mockFavorite),
    findOneBy: jest.fn().mockResolvedValue(mockFavorite),
    find: jest.fn().mockResolvedValue([mockFavorite]),
    save: jest.fn().mockResolvedValue(mockFavorite),
    remove: jest.fn().mockResolvedValue(mockFavorite),
    update: jest.fn().mockResolvedValue(mockFavorite),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
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
          useValue: {
            getProductById: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo favorito', async () => {
      mockRepo.findOneBy.mockResolvedValue(null); // Simula que o favorito não existe
      mockRepo.save.mockResolvedValue(mockRepo.create());

      const dto = { clientId: 1, productId: 1 };

      expect(await service.create(dto)).toEqual(mockFavorite);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({
        clientId: dto.clientId,
        productId: dto.productId,
      });
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(mockFavorite);
    });

    it('deve lançar uma exceção se o favorito já existir', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockRepo.create());

      const dto = { clientId: 1, productId: 2 };

      await expect(service.create(dto)).rejects.toThrow(
        new Error('Favorito já cadastrado.'),
      );
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({
        clientId: dto.clientId,
        productId: dto.productId,
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os favoritos do usuário', async () => {
      expect(await service.findAll()).toEqual([mockFavorite]);
      expect(mockRepo.find).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('deve retornar um favorito específico', async () => {
      expect(await service.findOne(1)).toEqual(mockFavorite);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('deve lançar uma exceção se o favorito não for encontrado', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(
        new Error('Favorito não encontrado.'),
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um favorito existente', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockFavorite);
      const dto = { clientId: 1, productId: 2 };

      expect(await service.update(1, dto)).toEqual(mockFavorite);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve lançar uma exceção se o favorito não for encontrado', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.update(1, {})).rejects.toThrow(
        new Error('Favorito não encontrado'),
      );
    });
  });

  describe('remove', () => {
    it('deve remover um favorito existente', async () => {
      mockRepo.findOneBy.mockResolvedValue(mockFavorite);
      await service.remove(1);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar uma exceção se o favorito não for encontrado', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(
        new Error('Favorito não encontrado'),
      );
    });
  });

  describe('getFavoritesByClientId', () => {
    it('deve retornar os favoritos de um cliente específico', async () => {
      mockRepo.find.mockResolvedValue([mockFavorite]);
      const result = await service.getFavoritesByClientId(1);
      expect(result).toEqual([mockProduct]);
      expect(mockRepo.find).toHaveBeenCalledWith({ where: { clientId: 1 } });
    });

    it('deve lançar uma exceção se nenhum favorito for encontrado', async () => {
      mockRepo.find.mockResolvedValue([]);
      await expect(service.getFavoritesByClientId(1)).rejects.toThrow(
        new Error('Nenhum favorito encontrado para este cliente.'),
      );
    });
  });
});
