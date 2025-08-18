import { Client } from 'src/clients/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ForeignKey,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('favorites')
@Unique(['clientId', 'productId'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ForeignKey(() => Client)
  clientId: number;

  @Column()
  productId: number;

  @Column({ nullable: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
