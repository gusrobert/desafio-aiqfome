import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TestAppModule } from './utils/test-app.module';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('FavoritesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/favorites (GET) deve retornar todos os favoritos', async () => {
    const response = await request(app.getHttpServer()).get('/favorites');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
