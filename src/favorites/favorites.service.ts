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
    const existingFavorite = await this.favoritesRepository.findOneBy({
      clientId: createFavoriteDto.clientId,
      productId: createFavoriteDto.productId,
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

  async findOne(id: number) {
    const favorite = await this.favoritesRepository.findOneBy({ id });

    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado.');
    }

    return favorite;
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    const favorite = await this.favoritesRepository.findOneBy({ id });

    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado');
    }

    await this.favoritesRepository.update(id, updateFavoriteDto);

    return this.favoritesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    const favorite = await this.favoritesRepository.findOneBy({ id });

    if (!favorite) {
      throw new NotFoundException('Favorito não encontrado');
    }

    await this.favoritesRepository.delete(id);
  }

  async getFavoritesByClientId(clientId: number) {
    const favorites = await this.favoritesRepository.find({
      where: { clientId },
    });

    if (!favorites.length) {
      throw new NotFoundException(
        `Nenhum favorito encontrado para este cliente.`,
      );
    }

    const products = await Promise.all(
      favorites.map(async (favorite) => {
        const product = await this.productsService.getProductById(
          favorite.productId,
        );
        return product;
      }),
    );

    return products;
  }
}
