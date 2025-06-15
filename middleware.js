import express from "express";
const router = express.Router();
export default router;
import jwt from 'jsonwebtoken';
router.use(express.json())

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded)
  req.user = decoded;
  if (!req.user) {
    return res.status(403).send("Invalid token");
  }
    next();
}