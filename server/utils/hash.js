const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new Error("Error hashing password: " + err.message);
  }
};

exports.comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    throw new Error("Error comparing password: " + err.message);
  }
};
