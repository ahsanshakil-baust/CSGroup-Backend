const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authurization = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(403).send("Access Denied");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    // res.json({ name: decoded.name, email: decoded.email });
    req.user = { id: decoded.id, name: decoded.name, email: decoded.email };
    next();
  } catch (err) {
    res.status(403).send("Invalid or expired token");
  }
};

module.exports = authurization;
