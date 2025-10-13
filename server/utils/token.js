const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.user_id,
      username: user.user_name,
      role: user.user_role,
    },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: "2d" }
  );
}

module.exports = { generateAccessToken };
