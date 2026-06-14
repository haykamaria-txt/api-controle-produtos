function admin(request, response, next) {
  if (request.user?.funcao !== "admin") {
    return response.status(403).json({ message: "Acesso restrito a administradores." });
  }

  return next();
}

module.exports = {
  admin,
};
