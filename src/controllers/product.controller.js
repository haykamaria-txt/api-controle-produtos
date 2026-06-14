const productService = require("../services/product.service");
const { sendErrorResponse } = require("../utils/error-response");

async function index(request, response) {
  try {
    const products = await productService.listProducts();
    return response.json(products);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function show(request, response) {
  try {
    const product = await productService.getProductById(request.params.id);
    return response.json(product);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function store(request, response) {
  try {
    const product = await productService.createProduct(request.body, request.user.id_usuario);
    return response.status(201).json(product);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function update(request, response) {
  try {
    const product = await productService.updateProduct(request.params.id, request.body);
    return response.json(product);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function destroy(request, response) {
  try {
    const product = await productService.deleteProduct(request.params.id);
    return response.json(product);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

module.exports = {
  destroy,
  index,
  show,
  store,
  update,
};
