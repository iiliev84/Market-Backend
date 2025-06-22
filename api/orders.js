import express from "express";
const router = express.Router();

import {
  getAllOrders,
  getOrderById,
  createOrder,
  deleteOrder
} from "#db/queries/orders";

router.get("/", async (req, res, next) => {
  try {
    const orders = await getAllOrders();
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

router.post("/", async (req, res, next) => {
  try {
    const { user_id, date, note } = req.body;
    const newOrder = await createOrder({ user_id, date, note });
    res.status(201).send(newOrder);
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