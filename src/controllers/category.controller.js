const categoryService = require("../services/category.service");
const { sendErrorResponse } = require("../utils/error-response");

async function index(request, response) {
  try {
    const categories = await categoryService.listCategories();
    return response.json(categories);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function show(request, response) {
  try {
    const category = await categoryService.getCategoryById(request.params.id);
    return response.json(category);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function store(request, response) {
  try {
    const category = await categoryService.createCategory(request.body);
    return response.status(201).json(category);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function update(request, response) {
  try {
    const category = await categoryService.updateCategory(request.params.id, request.body);
    return response.json(category);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function destroy(request, response) {
  try {
    await categoryService.deleteCategory(request.params.id);
    return response.status(204).send();
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
