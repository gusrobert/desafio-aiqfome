import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const existingEmail = await this.usersRepository.findOneBy({
      email: user.email,
    });

    if (existingEmail) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: { roles: { role: true } },
    });
  }

  async findOneByIdWithRoles(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { roles: { role: true } },
    });

    return user;
  }
}
