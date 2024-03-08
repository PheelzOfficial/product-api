const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied", success: false });
  }
  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifyToken;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid Token", success: false, error: err.message });
  }
};

module.exports = { verify };
