# Desafio Magalu - Backend com NestJS

API backend desenvolvida em NestJS para o desafio técnico Magalu / Aiqfome. Implementa autenticação JWT, controle de users e roles, gerenciamento de clientes e uso do TypeORM para migrations e seeders.

## Recursos principais

- Autenticação JWT
- Controle de acesso por roles (guards + decorators)
- Gerenciamento de clientes
- Migrations e seeders com TypeORM
- Documentação Swagger

## Pré‑requisitos

- Node.js (v18+ recomendado)
- PostgreSQL
- npm
- Docker (opcional)

## Instalação

```bash
npm install
```

## Configuração

Criar `.env` na raiz com as variáveis necessárias, por exemplo:

```
POSTGRES_HOST=localhost        # use `db` quando rodar via docker compose
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=aiqfome

BACKEND_PORT=3000
JWT_SECRET=uma_chave_secreta
FAKE_STORE_API_URL=https://fakestoreapi.com
```

## Migrations (TypeORM)

As migrations são controladas pelo TypeORM. Para rodar migrations localmente use o arquivo de DataSource (ex.: `src/data-source.ts`).

Executar migrations pendentes:

```bash
npm run typeorm -- migration:run -d src/data-source.ts
# ou
npx typeorm migration:run -d src/data-source.ts
```

Reverter última migration:

```bash
npx typeorm migration:revert -d src/data-source.ts
```

## Executando localmente

```bash
# desenvolvimento com restart automático
npm run start:dev

# produção (build + start)
npm run build
npm run start:prod
```

## Usando Docker Compose

Exemplo:

- Ajuste `POSTGRES_HOST=db` no `.env` quando rodar via Docker Compose.
- Para subir os serviços:

```bash
docker compose up --build
```

Para rodar migrations dentro do container:

```bash
docker compose exec backend npm run typeorm -- migration:run -d src/data-source.ts
```

## Documentação Swagger

Após iniciar a API, a documentação interativa fica em:

```
http://localhost:3000/api
```

Use o Swagger para inspecionar endpoints e testar chamadas.

## Autenticação

Enviar JWT no header:

```
Authorization: Bearer <token>
```

Rota de login pública: `POST /auth/login`  
Rota para perfil: `GET /auth/profile`

## Testes

```bash
# unitários
npm run test

# e2e
npm run test:e2e

# cobertura
npm run test:cov
```

## Scripts úteis (exemplos do package.json)

- start:dev — inicia em modo desenvolvimento
- build — transpila TS para JS
- start:prod — inicia a aplicação a partir do build
- typeorm — atalho para `typeorm-ts-node-esm` (use com `npm run typeorm -- <command> -d src/data-source.ts`)
