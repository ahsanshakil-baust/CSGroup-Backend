const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  const saltRounds = 10; // Number of salt rounds (higher = slower)
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw new Error("Error hashing password");
  }
};

module.exports = hashPassword;
