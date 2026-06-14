function isDatabaseConnectionError(error) {
  const message = error.message || "";

  return (
    error.name === "DriverAdapterError" ||
    message.includes("pool timeout") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Can't reach database") ||
    message.includes("Access denied")
  );
}

function getErrorResponse(error) {
  if (error.statusCode) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  if (isDatabaseConnectionError(error)) {
    return {
      statusCode: 503,
      message:
        "Nao foi possivel conectar ao banco de dados. Verifique DATABASE_URL e se o MySQL esta acessivel.",
    };
  }

  return {
    statusCode: 500,
    message: "Erro interno do servidor.",
  };
}

function sendErrorResponse(error, response) {
  const { statusCode, message } = getErrorResponse(error);

  return response.status(statusCode).json({ message });
}

module.exports = {
  getErrorResponse,
  sendErrorResponse,
};
