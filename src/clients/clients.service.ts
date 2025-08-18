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

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const existingClient = await this.clientsRepository.findOne({
      where: { email: createClientDto.email },
    });

    if (existingClient) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const client = this.clientsRepository.create(createClientDto);
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

    return this.clientsRepository.update(id, updateClientDto);
  }

  async remove(id: number) {
    const client = await this.clientsRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return this.clientsRepository.delete(id);
  }
}
