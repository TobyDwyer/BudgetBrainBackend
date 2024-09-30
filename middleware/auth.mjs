import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, "yygv42edew32", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

