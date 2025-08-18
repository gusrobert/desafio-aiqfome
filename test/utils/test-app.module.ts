import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesModule } from '../../src/favorites/favorites.module';
import { Favorite } from '../../src/favorites/entities/favorite.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Client, Favorite],
      synchronize: true,
    }),
    FavoritesModule,
    ClientsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class TestAppModule {}
