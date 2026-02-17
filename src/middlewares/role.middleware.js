const requireRole = (...roles) => {
  return (req, res, next) => {
    console.log("FULL req.user:", req.user);

    if (!req.user) {
      console.log("No user attached ❌");
      return res.status(401).json({ message: "No user found" });
    }

    console.log("User Role:", req.user.role);
    console.log("Allowed Roles:", roles);

    if (!roles.includes(req.user.role)) {
      console.log("Role mismatch ❌");
      return res.status(401).json({ message: "Forbidden" });
    }

    console.log("Role matched ✅");
    next();
  };
};

module.exports = requireRole;
