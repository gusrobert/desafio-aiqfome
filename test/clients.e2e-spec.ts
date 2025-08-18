import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TestAppModule } from './utils/test-app.module';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('ClientsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('deve criar, buscar, atualizar e deletar um cliente', async () => {
    // 1. Criar um cliente
    const createResponse = await request(app.getHttpServer())
      .post('/clients')
      .send({ name: 'Cliente Teste', email: 'cliente@teste.com' });
    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    const createdClientId = (createResponse.body as { id: number }).id;

    // 2. Buscar todos os clientes
    const getAllResponse = await request(app.getHttpServer()).get('/clients');
    expect(getAllResponse.status).toBe(200);
    expect(Array.isArray(getAllResponse.body)).toBe(true);

    // 3. Buscar o cliente criado
    const getClientResponse = await request(app.getHttpServer()).get(
      `/clients/${createdClientId}`,
    );
    expect(getClientResponse.status).toBe(200);
    expect(getClientResponse.body).toHaveProperty('id', createdClientId);

    // 4. Atualizar o cliente
    const updateResponse = await request(app.getHttpServer())
      .patch(`/clients/${createdClientId}`)
      .send({
        name: 'Cliente Teste Atualizado',
        email: 'cliente.atualizado@teste.com',
      });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('id', createdClientId);

    // 5. Deletar o cliente
    const deleteResponse = await request(app.getHttpServer()).delete(
      `/clients/${createdClientId}`,
    );
    expect(deleteResponse.status).toBe(204);
  });
});
