const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "CRUD Node API",
    version: "1.0.0",
    description: "Documentacao da API RESTful.",
  },
  servers: [
    {
      url: "/",
      description: "Mesma origem da documentacao Swagger",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Descricao do erro",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "usuario@example.com",
          },
          senha: {
            type: "string",
            format: "password",
            example: "senha123",
          },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: {
          nome: {
            type: "string",
            example: "Usuario Exemplo",
          },
          email: {
            type: "string",
            format: "email",
            example: "usuario@example.com",
          },
          senha: {
            type: "string",
            format: "password",
            example: "senha123",
          },
          funcao: {
            type: "string",
            enum: ["user", "admin"],
            default: "user",
            example: "user",
          },
        },
      },
      Usuario: {
        type: "object",
        properties: {
          id_usuario: {
            type: "integer",
            example: 1,
          },
          email: {
            type: "string",
            format: "email",
            example: "usuario@example.com",
          },
          nome: {
            type: "string",
            example: "Usuario Exemplo",
          },
          funcao: {
            type: "string",
            enum: ["user", "admin"],
            example: "user",
          },
          criado_em: {
            type: "string",
            format: "date-time",
          },
          atualizado_em: {
            type: "string",
            format: "date-time",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          user: {
            $ref: "#/components/schemas/Usuario",
          },
        },
      },
      Categoria: {
        type: "object",
        properties: {
          id_categoria: {
            type: "integer",
            example: 1,
          },
          nome: {
            type: "string",
            example: "Eletronicos",
          },
          descricao: {
            type: "string",
            nullable: true,
            example: "Produtos eletronicos em geral",
          },
          criado_em: {
            type: "string",
            format: "date-time",
          },
          atualizado_em: {
            type: "string",
            format: "date-time",
          },
        },
      },
      CategoryRequest: {
        type: "object",
        required: ["nome"],
        properties: {
          nome: {
            type: "string",
            example: "Eletronicos",
          },
          descricao: {
            type: "string",
            nullable: true,
            example: "Produtos eletronicos em geral",
          },
        },
      },
      Produto: {
        type: "object",
        properties: {
          id_produto: {
            type: "integer",
            example: 1,
          },
          nome: {
            type: "string",
            example: "Notebook",
          },
          descricao: {
            type: "string",
            nullable: true,
            example: "Notebook para trabalho",
          },
          preco: {
            type: "number",
            format: "decimal",
            example: 3499.99,
          },
          estoque: {
            type: "integer",
            example: 10,
          },
          ativo_sn: {
            type: "boolean",
            example: true,
          },
          fk_categoria_id: {
            type: "integer",
            example: 1,
          },
          fk_criado_pelo_usuario: {
            type: "integer",
            example: 1,
          },
          criado_em: {
            type: "string",
            format: "date-time",
          },
          atualizado_em: {
            type: "string",
            format: "date-time",
          },
          categoria: {
            type: "object",
            properties: {
              id_categoria: {
                type: "integer",
                example: 1,
              },
              nome: {
                type: "string",
                example: "Eletronicos",
              },
            },
          },
          usuario: {
            type: "object",
            properties: {
              id_usuario: {
                type: "integer",
                example: 1,
              },
              nome: {
                type: "string",
                example: "Administrador",
              },
            },
          },
        },
      },
      ProductRequest: {
        type: "object",
        required: ["nome", "preco", "estoque", "fk_categoria_id"],
        properties: {
          nome: {
            type: "string",
            example: "Notebook",
          },
          descricao: {
            type: "string",
            nullable: true,
            example: "Notebook para trabalho",
          },
          preco: {
            type: "number",
            format: "decimal",
            minimum: 0,
            example: 3499.99,
          },
          estoque: {
            type: "integer",
            minimum: 0,
            example: 10,
          },
          ativo_sn: {
            type: "boolean",
            example: true,
          },
          fk_categoria_id: {
            type: "integer",
            example: 1,
          },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registra um novo usuario.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuario registrado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Usuario",
                },
              },
            },
          },
          400: {
            description: "Dados invalidos.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          409: {
            description: "Email ja cadastrado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Autentica um usuario.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login realizado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          400: {
            description: "Dados obrigatorios ausentes.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Credenciais invalidas.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Retorna o usuario autenticado.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Usuario autenticado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Usuario",
                },
              },
            },
          },
          401: {
            description: "Token ausente ou invalido.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "Lista categorias.",
        responses: {
          200: {
            description: "Lista de categorias.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Categoria",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Cria uma categoria.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CategoryRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Categoria criada.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Categoria",
                },
              },
            },
          },
          401: {
            description: "Token ausente ou invalido.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "Usuario sem permissao de administrador.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          409: {
            description: "Categoria duplicada.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Busca categoria por ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Categoria encontrada.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Categoria",
                },
              },
            },
          },
          404: {
            description: "Categoria nao encontrada.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Categories"],
        summary: "Atualiza uma categoria.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CategoryRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Categoria atualizada.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Categoria",
                },
              },
            },
          },
          401: {
            description: "Token ausente ou invalido.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "Usuario sem permissao de administrador.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Categoria nao encontrada.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Exclui uma categoria.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          204: {
            description: "Categoria excluida.",
          },
          401: {
            description: "Token ausente ou invalido.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "Usuario sem permissao de administrador.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          409: {
            description: "Categoria possui produtos vinculados.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Lista produtos.",
        responses: {
          200: {
            description: "Lista de produtos.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Produto",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Cria um produto.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Produto criado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Produto",
                },
              },
            },
          },
          401: {
            description: "Token ausente ou invalido.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "Usuario sem permissao de administrador.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Busca produto por ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Produto encontrado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Produto",
                },
              },
            },
          },
          404: {
            description: "Produto nao encontrado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Atualiza um produto.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProductRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Produto atualizado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Produto",
                },
              },
            },
          },
          401: {
            description: "Token ausente ou invalido.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "Usuario sem permissao de administrador.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "Produto nao encontrado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Realiza exclusao logica de um produto.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Produto desativado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Produto",
                },
              },
            },
          },
          401: {
            description: "Token ausente ou invalido.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          403: {
            description: "Usuario sem permissao de administrador.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});

module.exports = {
  swaggerServe: swaggerUi.serve,
  swaggerSetup: swaggerUi.setup(swaggerSpec),
  swaggerSpec,
};
