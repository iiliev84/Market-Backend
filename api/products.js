import express from "express";
const router = express.Router();
export default router;

import { createProduct } from "../db/queries/products.js"

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
