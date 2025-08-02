const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  const bearerToken = token.split(" ")[1]; // Remove 'Bearer' prefix

  try {
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = decoded; // Store decoded user data
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;