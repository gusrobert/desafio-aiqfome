import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
