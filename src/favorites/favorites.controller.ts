import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: 'Cria um novo favorito' })
  @ApiResponse({ status: 201, description: 'Favorito criado com sucesso.' })
  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @ApiOperation({ summary: 'Lista todos os favoritos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de favoritos retornada com sucesso.',
  })
  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @ApiOperation({
    summary: 'Lista um favorito específico',
    parameters: [{ name: 'id', in: 'path', required: true }],
  })
  @ApiResponse({
    status: 200,
    description: 'Favorito encontrado com sucesso.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualiza um favorito' })
  @ApiResponse({
    status: 200,
    description: 'Favorito atualizado com sucesso.',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return this.favoritesService.update(+id, updateFavoriteDto);
  }

  @ApiOperation({ summary: 'Remove um favorito' })
  @ApiResponse({
    status: 204,
    description: 'Favorito removido com sucesso.',
  })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(+id);
  }

  @ApiOperation({ summary: 'Lista favoritos de um cliente específico' })
  @ApiResponse({
    status: 200,
    description: 'Lista de favoritos do cliente retornada com sucesso.',
  })
  @Get('client/:clientId')
  getFavoritesByClientId(@Param('clientId') clientId: string) {
    return this.favoritesService.getFavoritesByClientId(+clientId);
  }
}
