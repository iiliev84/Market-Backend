import express from "express";
const app = express();
export default app;

app.use(express.json())

app.get('/', async( req, res, next ) => {
  res.send('Welcome to the Market Bookstore!')
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
