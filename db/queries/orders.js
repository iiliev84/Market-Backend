import db from "../client.js";

export async function getAllOrders() {
  const { rows } = await db.query(`SELECT * FROM orders;`);
  return rows;
}

export async function getOrderById(id) {
  const { rows: [order] } = await db.query(`SELECT * FROM orders WHERE id = $1;`, [id]);
  return order;
}

export async function createOrder({ user_id, date, note }) {
  const { rows: [order] } = await db.query(`
    INSERT INTO orders (user_id, date, note)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [user_id, date, note]);
  return order;
}

export async function deleteOrder(id) {
  const { rows: [deleted] } = await db.query(`DELETE FROM orders WHERE id = $1 RETURNING *;`, [id]);
  return deleted;
}