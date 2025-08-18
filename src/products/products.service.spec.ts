import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpService: { get: jest.Mock };
  let cacheManager: { get: jest.Mock; set: jest.Mock };

  const mockProduct = {
    id: 1,
    title: 'Product 1',
    price: 100,
    description: 'Description 1',
    category: 'Category 1',
    image: 'image1.jpg',
    rating: {
      rate: 4.5,
      count: 10,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    httpService = { get: jest.fn() };
    cacheManager = { get: jest.fn(), set: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: HttpService, useValue: httpService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'FAKE_STORE_API_URL') {
                return process.env.FAKE_STORE_API_URL;
              }

              return null;
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('deve retornar todos os produtos', async () => {
      cacheManager.get.mockResolvedValueOnce(null);
      httpService.get.mockReturnValueOnce(of({ data: [mockProduct] }));

      const result = await service.getAllProducts();
      expect(result).toEqual([mockProduct]);
      expect(cacheManager.set).toHaveBeenCalledWith(
        'products',
        [mockProduct],
        3600,
      );
    });
  });

  describe('getProductById', () => {
    it('deve retornar um produto pelo id', async () => {
      cacheManager.get.mockResolvedValueOnce(null);
      httpService.get.mockReturnValueOnce(of({ data: mockProduct }));

      const result = await service.getProductById(1);
      expect(result).toEqual(mockProduct);
      expect(cacheManager.set).toHaveBeenCalledWith(
        'product_1',
        mockProduct,
        3600,
      );
    });
  });
});
