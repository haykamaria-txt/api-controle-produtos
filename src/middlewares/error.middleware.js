const { getErrorResponse } = require("../utils/error-response");

function notFoundHandler(request, response) {
  return response.status(404).json({ message: "Rota nao encontrada." });
}

function errorHandler(error, request, response, _next) {
  const { statusCode, message } = getErrorResponse(error);

  return response.status(statusCode).json({ message });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
