import db from "../client.js"

export async function createProduct( {title, image_url, description, price} ) {
  const sql = `
    INSERT INTO products (title, image_url, description, price) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *;
    `
  const {rows: product} = await db.query(sql, [title, image_url, description, price])
  return product[0]
}

export async function getProducts(){
    const sql = `
    SELECT *
    FROM products
    `;
    const {rows: products} = await db.query(sql);
    return products;
}

export async function getProductById(id) {
  const sql = `
  SELECT *
  FROM products
  WHERE id = $1
  `;
  const {rows: [product],} = await db.query(sql, [id]);
  return product;
}