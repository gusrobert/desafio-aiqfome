import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, CacheModule.register(), ConfigModule],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
