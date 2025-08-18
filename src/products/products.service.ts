import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly baseUrl: string;
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.baseUrl = this.configService.get<string>('FAKE_STORE_API_URL') ?? '';
    if (!this.baseUrl) {
      console.warn(
        'FAKE_STORE_API_URL não definida. As requisições podem falhar.',
      );
    }
  }

  async onModuleInit() {
    await this.preloadProducts().catch((error) => {
      this.logger.error('Erro ao fazer preload dos produtos:', error);
    });
  }

  private async preloadProducts() {
    if (!this.baseUrl) {
      this.logger.warn(
        'Fake Store API URL não definida, não será possível fazer preload dos produtos.',
      );
      return;
    }
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/products`),
      );
      const data = response.data as ProductDto[];

      await this.cacheManager.set('products', data, 3600);

      for (const product of data) {
        await this.cacheManager.set(`product_${product.id}`, product, 3600);
      }
    } catch (error) {
      this.logger.error('Erro ao fazer preload dos produtos:', error);
    }
  }

  async getAllProducts(): Promise<ProductDto[]> {
    const cachedProducts =
      await this.cacheManager.get<ProductDto[]>('products');
    if (cachedProducts) {
      return cachedProducts;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/products`),
      );
      const data = response.data as ProductDto[];

      await this.cacheManager.set('products', data, 3600);
      return data;
    } catch (error) {
      this.logger.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<ProductDto> {
    const cachedProduct = await this.cacheManager.get<ProductDto>(
      `product_${id}`,
    );
    if (cachedProduct) {
      return cachedProduct;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/products/${id}`),
      );
      const data = response.data as ProductDto;

      await this.cacheManager.set(`product_${id}`, data, 3600);
      return data;
    } catch (error) {
      this.logger.error('Erro ao buscar produto:', error);
      throw error;
    }
  }
}
