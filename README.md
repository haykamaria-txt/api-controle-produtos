# CRUD Node API

API RESTful desenvolvida em Node.js para gerenciamento de usuários, categorias e produtos. O projeto usa autenticação com JWT, senhas com hash usando bcrypt, Prisma Client gerado localmente em `./generated/prisma` e banco de dados MySQL.

## Stack utilizada

- Node.js
- Express.js
- MySQL
- Prisma
- JWT
- bcrypt
- Jest
- Supertest
- Swagger/OpenAPI
- ESLint
- Prettier

## Funcionalidades principais

- Health check da API.
- Cadastro e login de usuários.
- Autenticação com JWT.
- Controle de acesso por perfil `user` e `admin`.
- CRUD de categorias.
- CRUD de produtos.
- Exclusão lógica de produtos usando `ativo_sn = false`.
- Documentação Swagger/OpenAPI em rota dedicada.
- Testes automatizados básicos com Jest e Supertest.

## Modelo de acesso

A API usa dois perfis de usuário:

- `user`: usuário comum. Pode autenticar e consultar rotas publicas.
- `admin`: administrador. Pode criar, editar e remover categorias e produtos.

Rotas protegidas exigem o header:

```http
Authorization: Bearer seu_token_jwt
```

## Instalação

Instale as dependências:

```bash
npm install
```

O Prisma Client deste projeto foi gerado localmente em `./generated/prisma`. Não é necessário rodar migrations para usar a estrutura atual.

## Como rodar

Ambiente de desenvolvimento:

```bash
npm run dev
```

Ambiente normal:

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

Se `PORT` estiver definido no `.env`, a aplicação usará a porta informada.

## Rodando com Docker


Suba a API com Docker Compose:

```bash
docker compose up --build
```

A API ficará disponível em:

```text
http://localhost:3000
```

A documentação Swagger ficará disponível em:

```text
http://localhost:3000/api-docs
```

Para testar a rota de health check:

```bash
curl http://localhost:3000/health
```

A resposta esperada e:

```json
{ "status": "ok" }
```

## Documentação Swagger

A documentação OpenAPI fica disponivel em:

```text
GET /api-docs
```

Exemplo local:

```text
http://localhost:3000/api-docs
```

## Testes

Execute os testes com:

```bash
npm test
```

Os testes usam Jest e Supertest. Sempre que possível, os testes evitam depender de dados fixos do banco.

## Qualidade de codigo

Rodar ESLint:

```bash
npm run lint
```

Formatar arquivos com Prettier:

```bash
npm run format
```

Verificar formatação:

```bash
npm run format:check
```

## Estrutura de pastas

```text
docs/
  README.md
src/
  app.js
  server.js
  prisma.js
  controllers/
    auth.controller.js
    category.controller.js
    health.controller.js
    product.controller.js
  docs/
    swagger.js
  middlewares/
    admin.middleware.js
    auth.middleware.js
    error.middleware.js
  routes/
    auth.routes.js
    category.routes.js
    health.routes.js
    product.routes.js
  services/
    auth.service.js
    category.service.js
    product.service.js
  __tests__/
    app.test.js
prisma/
  schema.prisma
generated/
  prisma/
```

## Endpoints principais

### Health

| Método | Rota      | Acesso  | Descrição                    |
| ------ | --------- | ------- | ---------------------------- |
| GET    | `/health` | Público | Verifica se a API está ativa |

### Auth

| Método | Rota             | Acesso      | Descrição                       |
| ------ | ---------------- | ----------- | ------------------------------- |
| POST   | `/auth/register` | Público     | Cadastra um usuário             |
| POST   | `/auth/login`    | Público     | Autentica usuário e retorna JWT |
| GET    | `/auth/me`       | Autenticado | Retorna o usuário autenticado   |

### Categories

| Método | Rota              | Acesso  | Descrição              |
| ------ | ----------------- | ------- | ---------------------- |
| GET    | `/categories`     | Público | Lista categorias       |
| GET    | `/categories/:id` | Público | Busca categoria por ID |
| POST   | `/categories`     | Admin   | Cria categoria         |
| PUT    | `/categories/:id` | Admin   | Atualiza categoria     |
| DELETE | `/categories/:id` | Admin   | Exclui categoria       |

### Products

| Método | Rota            | Acesso  | Descrição                            |
| ------ | --------------- | ------- | ------------------------------------ |
| GET    | `/products`     | Público | Lista produtos                       |
| GET    | `/products/:id` | Público | Busca produto por ID                 |
| POST   | `/products`     | Admin   | Cria produto                         |
| PUT    | `/products/:id` | Admin   | Atualiza produto                     |
| DELETE | `/products/:id` | Admin   | Desativa produto com exclusão lógica |

## Observações sobre o banco

O projeto usa tabelas existentes do MySQL:

- `usuario`
- `categoria`
- `produto`

O Prisma foi configurado para usar o client local gerado em `./generated/prisma`, importado por `src/prisma.js`. As senhas dos usuários são armazenadas apenas como hash em `senha_hash`.
