const prisma = require("../prisma");

const productSelect = {
  id_produto: true,
  nome: true,
  descricao: true,
  preco: true,
  estoque: true,
  ativo_sn: true,
  fk_categoria_id: true,
  fk_criado_pelo_usuario: true,
  criado_em: true,
  atualizado_em: true,
  categoria: {
    select: {
      id_categoria: true,
      nome: true,
    },
  },
  usuario: {
    select: {
      id_usuario: true,
      nome: true,
    },
  },
};

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseProductId(id) {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    throw createError(400, "ID do produto invalido.");
  }

  return productId;
}

function parseCategoryId(id) {
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw createError(400, "ID da categoria invalido.");
  }

  return categoryId;
}

function validateRequiredFields(fields) {
  const missingFields = Object.entries(fields)
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([field]) => field);

  if (missingFields.length > 0) {
    throw createError(400, `Campos obrigatorios ausentes: ${missingFields.join(", ")}.`);
  }
}

function validatePrice(preco) {
  if (preco === "") {
    throw createError(400, "O campo preco deve ser numerico.");
  }

  const parsedPrice = Number(preco);

  if (Number.isNaN(parsedPrice)) {
    throw createError(400, "O campo preco deve ser numerico.");
  }

  if (parsedPrice < 0) {
    throw createError(400, "O campo preco nao pode ser negativo.");
  }

  return preco;
}

function validateStock(estoque) {
  if (estoque === "") {
    throw createError(400, "O campo estoque deve ser um numero inteiro.");
  }

  const parsedStock = Number(estoque);

  if (!Number.isInteger(parsedStock)) {
    throw createError(400, "O campo estoque deve ser um numero inteiro.");
  }

  if (parsedStock < 0) {
    throw createError(400, "O campo estoque nao pode ser negativo.");
  }

  return parsedStock;
}

function parseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw createError(400, "O campo ativo_sn deve ser booleano.");
}

async function ensureCategoryExists(id) {
  const id_categoria = parseCategoryId(id);

  const category = await prisma.categoria.findUnique({
    where: { id_categoria },
    select: { id_categoria: true },
  });

  if (!category) {
    throw createError(404, "Categoria nao encontrada.");
  }

  return id_categoria;
}

async function listProducts() {
  return prisma.produto.findMany({
    orderBy: { id_produto: "asc" },
    select: productSelect,
  });
}

async function getProductById(id) {
  const id_produto = parseProductId(id);

  const product = await prisma.produto.findUnique({
    where: { id_produto },
    select: productSelect,
  });

  if (!product) {
    throw createError(404, "Produto nao encontrado.");
  }

  return product;
}

async function createProduct({ nome, descricao, preco, estoque, fk_categoria_id }, userId) {
  validateRequiredFields({ nome, preco, estoque, fk_categoria_id });

  const validPrice = validatePrice(preco);
  const validStock = validateStock(estoque);
  const validCategoryId = await ensureCategoryExists(fk_categoria_id);

  return prisma.produto.create({
    data: {
      nome,
      descricao,
      preco: validPrice,
      estoque: validStock,
      fk_categoria_id: validCategoryId,
      fk_criado_pelo_usuario: userId,
    },
    select: productSelect,
  });
}

async function updateProduct(id, { nome, descricao, preco, estoque, ativo_sn, fk_categoria_id }) {
  const id_produto = parseProductId(id);
  await getProductById(id_produto);

  const data = {
    atualizado_em: new Date(),
  };

  if (nome !== undefined) {
    if (!nome) {
      throw createError(400, "O campo nome nao pode ser vazio.");
    }

    data.nome = nome;
  }

  if (descricao !== undefined) {
    data.descricao = descricao;
  }

  if (preco !== undefined) {
    data.preco = validatePrice(preco);
  }

  if (estoque !== undefined) {
    data.estoque = validateStock(estoque);
  }

  if (ativo_sn !== undefined) {
    data.ativo_sn = parseBoolean(ativo_sn);
  }

  if (fk_categoria_id !== undefined) {
    data.fk_categoria_id = await ensureCategoryExists(fk_categoria_id);
  }

  return prisma.produto.update({
    where: { id_produto },
    data,
    select: productSelect,
  });
}

async function deleteProduct(id) {
  const id_produto = parseProductId(id);
  await getProductById(id_produto);

  return prisma.produto.update({
    where: { id_produto },
    data: {
      ativo_sn: false,
      atualizado_em: new Date(),
    },
    select: productSelect,
  });
}

module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
};
