const prisma = require("../prisma");

const publicCategorySelect = {
  id_categoria: true,
  nome: true,
  descricao: true,
  criado_em: true,
  atualizado_em: true,
};

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseCategoryId(id) {
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw createError(400, "ID da categoria invalido.");
  }

  return categoryId;
}

function validateName(nome) {
  if (!nome) {
    throw createError(400, "O campo nome e obrigatorio.");
  }
}

async function ensureUniqueName(nome, currentCategoryId) {
  const existingCategory = await prisma.categoria.findUnique({
    where: { nome },
    select: { id_categoria: true },
  });

  if (existingCategory && existingCategory.id_categoria !== currentCategoryId) {
    throw createError(409, "Ja existe uma categoria cadastrada com este nome.");
  }
}

async function listCategories() {
  return prisma.categoria.findMany({
    orderBy: { id_categoria: "asc" },
    select: publicCategorySelect,
  });
}

async function getCategoryById(id) {
  const id_categoria = parseCategoryId(id);

  const category = await prisma.categoria.findUnique({
    where: { id_categoria },
    select: publicCategorySelect,
  });

  if (!category) {
    throw createError(404, "Categoria nao encontrada.");
  }

  return category;
}

async function createCategory({ nome, descricao }) {
  validateName(nome);
  await ensureUniqueName(nome);

  return prisma.categoria.create({
    data: {
      nome,
      descricao,
    },
    select: publicCategorySelect,
  });
}

async function updateCategory(id, { nome, descricao }) {
  const id_categoria = parseCategoryId(id);
  validateName(nome);
  await getCategoryById(id_categoria);
  await ensureUniqueName(nome, id_categoria);

  return prisma.categoria.update({
    where: { id_categoria },
    data: {
      nome,
      descricao,
      atualizado_em: new Date(),
    },
    select: publicCategorySelect,
  });
}

async function deleteCategory(id) {
  const id_categoria = parseCategoryId(id);
  await getCategoryById(id_categoria);

  try {
    await prisma.categoria.delete({
      where: { id_categoria },
    });
  } catch (error) {
    if (error.code === "P2003") {
      throw createError(
        409,
        "Nao foi possivel excluir a categoria porque existem produtos vinculados."
      );
    }

    throw error;
  }
}

module.exports = {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
};
