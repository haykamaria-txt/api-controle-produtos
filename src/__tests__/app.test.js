const request = require("supertest");

jest.mock("../prisma", () => ({
  categoria: {
    findMany: jest.fn(),
  },
  produto: {
    findMany: jest.fn(),
  },
  usuario: {
    findUnique: jest.fn(),
  },
}));

const app = require("../app");
const prisma = require("../prisma");

describe("API routes", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  test("GET /health deve retornar status 200", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("POST /auth/register deve validar campos obrigatorios", async () => {
    const response = await request(app).post("/auth/register").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Campos obrigatorios ausentes: nome, email, senha.",
    });
    expect(prisma.usuario.findUnique).not.toHaveBeenCalled();
  });

  test("POST /auth/login deve rejeitar credenciais invalidas", async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    const response = await request(app).post("/auth/login").send({
      email: "inexistente@example.com",
      senha: "senha-incorreta",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Email ou senha invalidos." });
  });

  test("GET /products deve retornar lista ou array vazio", async () => {
    prisma.produto.findMany.mockResolvedValue([]);

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("GET /categories deve retornar lista ou array vazio", async () => {
    prisma.categoria.findMany.mockResolvedValue([]);

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
