const jwt = require("jsonwebtoken");

function authenticate(request, response, next) {
  const authorizationHeader = request.headers.authorization || "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({ message: "Token de autenticacao nao informado." });
  }

  if (!process.env.JWT_SECRET) {
    return response.status(500).json({ message: "JWT_SECRET nao configurado." });
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response.status(401).json({ message: "Token expirado." });
    }

    return response.status(401).json({ message: "Token invalido." });
  }
}

module.exports = {
  authenticate,
};
