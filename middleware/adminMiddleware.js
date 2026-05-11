import jwt from "jsonwebtoken";

const checkAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    req.admin = decoded;

    next();

  } catch (err) {
    console.error("JWT ERROR:", err);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default checkAdmin;