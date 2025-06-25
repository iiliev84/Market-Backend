import express from "express";
import { verifyToken } from "../middleware.js"; 
const router = express.Router();

import {
  getAllOrders,
  getOrderById,
  createOrder,
  deleteOrder,
  getOrdersByUserId
} from "#db/queries/orders";

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUserId(userId);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    res.send(order);
  } catch (err) {
    next(err);
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { date, note } = req.body;

    const newOrder = await createOrder({ user_id, date, note });
    res.send(newOrder);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteOrder(req.params.id);
    res.send(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;