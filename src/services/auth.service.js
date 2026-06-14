const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../prisma");

const SALT_ROUNDS = 10;
const DEFAULT_ROLE = "user";
const VALID_ROLES = ["user", "admin"];

const publicUserSelect = {
  id_usuario: true,
  email: true,
  nome: true,
  funcao: true,
  criado_em: true,
  atualizado_em: true,
};

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateRequiredFields(fields) {
  const missingFields = Object.entries(fields)
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([field]) => field);

  if (missingFields.length > 0) {
    throw createError(400, `Campos obrigatorios ausentes: ${missingFields.join(", ")}.`);
  }
}

function validateRole(funcao) {
  if (!VALID_ROLES.includes(funcao)) {
    throw createError(400, "Funcao invalida. Use user ou admin.");
  }
}

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw createError(500, "JWT_SECRET nao configurado.");
  }

  return jwt.sign(
    {
      id_usuario: user.id_usuario,
      email: user.email,
      funcao: user.funcao,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
}

async function register({ nome, email, senha, funcao = DEFAULT_ROLE }) {
  validateRequiredFields({ nome, email, senha });
  validateRole(funcao);

  const existingUser = await prisma.usuario.findUnique({
    where: { email },
    select: { id_usuario: true },
  });

  if (existingUser) {
    throw createError(409, "Ja existe um usuario cadastrado com este email.");
  }

  const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);

  return prisma.usuario.create({
    data: {
      nome,
      email,
      senha_hash,
      funcao,
    },
    select: publicUserSelect,
  });
}

async function login({ email, senha }) {
  validateRequiredFields({ email, senha });

  const user = await prisma.usuario.findUnique({
    where: { email },
    select: {
      ...publicUserSelect,
      senha_hash: true,
    },
  });

  if (!user) {
    throw createError(401, "Email ou senha invalidos.");
  }

  const passwordMatches = await bcrypt.compare(senha, user.senha_hash);

  if (!passwordMatches) {
    throw createError(401, "Email ou senha invalidos.");
  }

  const publicUser = { ...user };
  delete publicUser.senha_hash;

  return {
    token: generateToken(publicUser),
    user: publicUser,
  };
}

async function getAuthenticatedUser(id_usuario) {
  const user = await prisma.usuario.findUnique({
    where: { id_usuario },
    select: publicUserSelect,
  });

  if (!user) {
    throw createError(404, "Usuario autenticado nao encontrado.");
  }

  return user;
}

module.exports = {
  getAuthenticatedUser,
  login,
  register,
};
