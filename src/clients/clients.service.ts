import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private readonly usersService: UsersService,
  ) {}

  async create(createClientDto: CreateClientDto) {
    let user: User;
    try {
      user = await this.usersService.create(createClientDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('E-mail já cadastrado.');
      }
      throw error;
    }

    const client = this.clientsRepository.create({
      ...createClientDto,
      userId: user.id,
    });
    return this.clientsRepository.save(client);
  }

  findAll() {
    return this.clientsRepository.find();
  }

  async findOne(id: number) {
    const client = await this.clientsRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    await this.clientsRepository.update(id, updateClientDto);

    return this.clientsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    await this.clientsRepository.remove(client);
  }
}
