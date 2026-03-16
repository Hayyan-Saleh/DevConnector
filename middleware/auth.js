import jwt from "jsonwebtoken";
import config from "config";

const jwtMiddleware = (req, res, next) => {
  // Check for jwt existance
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization failed" });
  }
  // Validate token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

export default jwtMiddleware;
