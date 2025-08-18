import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    private productsService: ProductsService,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    const existingFavorite = await this.favoritesRepository.findOne({
      where: {
        clientId: createFavoriteDto.clientId,
        productId: createFavoriteDto.productId,
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Favorito já cadastrado.');
    }

    const favorite = this.favoritesRepository.create(createFavoriteDto);
    return this.favoritesRepository.save(favorite);
  }

  findAll() {
    return this.favoritesRepository.find();
  }

  findOne(id: number) {
    return this.favoritesRepository.findOne({ where: { id } });
  }

  update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return this.favoritesRepository.update(id, updateFavoriteDto);
  }

  remove(id: number) {
    return this.favoritesRepository.delete(id);
  }

  async getFavoritesByClient(clientId: number) {
    const favorites = await this.favoritesRepository.find({
      where: { clientId },
    });

    if (!favorites.length) {
      throw new NotFoundException(`
        Nenhum favorito encontrado para este cliente.
      `);
    }

    const products = await Promise.all(
      favorites.map(async (favorite) => {
        const product = await this.productsService.getProductById(
          favorite.productId,
        );
        return {
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.image,
        };
      }),
    );

    return products;
  }
}
