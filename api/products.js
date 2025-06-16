import express from "express";
const router = express.Router();
export default router;
import { createProduct, getProductById, getProducts } from "../db/queries/products.js"

router.route("/").get(async (req, res) => {
    const products = await getProducts();
    res.send(products);
});

router.route("/:id").get(async (req,res)=>{
  const {id} = req.params

  const product = await getProductById(id)

  if (!product){
      return res.status(404).send({error: "ID does not exist."})
    }
    res.send(product)
})

router.route("/").post(async (req, res)=>{
    if(!req.body){
      return res.status(400).send({error: "Missing req. body"})
    }
    
    const {title, description, price} = req.body
    
    if(!title || !description || !price){
      return res.status(400).send({error: "Missing required params"})
    }

  const product = await createProduct({title, description, price})

  res.status(201).send(product)
})
