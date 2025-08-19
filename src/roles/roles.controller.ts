import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Cria um novo perfil' })
  @ApiResponse({ status: 201, description: 'Perfil criado com sucesso.' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Lista todos os perfis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfis retornada com sucesso.',
  })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Busca um perfil pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado com sucesso.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualiza um perfil pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Remove um perfil pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Perfil removido com sucesso.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
