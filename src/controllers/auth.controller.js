const authService = require("../services/auth.service");
const { sendErrorResponse } = require("../utils/error-response");

async function register(request, response) {
  try {
    const user = await authService.register(request.body);
    return response.status(201).json(user);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function login(request, response) {
  try {
    const result = await authService.login(request.body);
    return response.json(result);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function me(request, response) {
  try {
    const user = await authService.getAuthenticatedUser(request.user.id_usuario);
    return response.json(user);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

module.exports = {
  login,
  me,
  register,
};
