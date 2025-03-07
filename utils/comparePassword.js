const bcrypt = require("bcrypt");

const comparePassword = async (enteredPassword, storedHashedPassword) => {
  try {
    const match = await bcrypt.compare(enteredPassword, storedHashedPassword);
    if (match) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error("Error comparing password");
  }
};

module.exports = comparePassword;
