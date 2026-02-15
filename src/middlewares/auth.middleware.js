const jwt = require("jsonwebtoken");

console.log("⚡ auth.middleware loaded, NODE_ENV =", process.env.NODE_ENV);

const authenticate = (req, res, next) => {
  console.log("⚡ Incoming request:", req.method, req.path);
  console.log("⚡ Request headers:", req.headers);

  // Dev bypass
  if (process.env.NODE_ENV === "development") {
    console.log("⚡ Dev bypass active, setting dummy user");
    req.user = { id: "dev-user", role: "developer" };
    return next();
  }

  // Normal JWT auth
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("⚠️ No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("⚡ Token decoded:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("⚠️ Invalid token:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticate;
