import { Client } from 'src/clients/entities/client.entity';
import {
  Column,
  Entity,
  ForeignKey,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @PrimaryColumn()
  @ForeignKey(() => Client)
  clientId: number;

  @Column()
  @PrimaryColumn()
  productId: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
