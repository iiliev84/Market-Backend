import express from "express";
const app = express();
export default app;
import usersRouter from "#api/users";
import productsRouter from "#api/products"
import cors from "cors";
app.use(cors());
app.use(express.json())

app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.get('/', async( req, res, next ) => {
  res.send('Welcome to the Market Bookstore!')
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
