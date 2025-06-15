import express from "express";
const router = express.Router();
export default router;
import db from "#db/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { getUsers, getUserById } from "#db/queries/users"
import {verifyToken} from "#middleware"

router.route("/").get(async (req, res) => {
    const users = await getUsers();
    res.send(users);
});

router.post('/register', async (req, res, next) => {
  const {username, password} = req.body;
  try{
    const hashedPassword = await bcrypt.hash(password, 5)
    const result = await db.query(`INSERT INTO users (username, password)
      VALUES ($1, $2) RETURNING *;`, [username, hashedPassword]);
      const newUser = result.rows[0]
      if(!newUser) return res.status(401).send(`Couldnt create new user`);
      const token = jwt.sign({id: newUser.id, username: newUser.username}, process.env.JWT_SECRET);
      res.status(201).json(token)
  }catch(error){
    console.log(error)
    res.send('Error registering')
  }
})

router.post('/login', async(req,res,next) => {
  const {username, password} = req.body;
  try {
    const result = await db.query(`SELECT * FROM users WHERE username = $1;`, [username]); 
    const realUserInfo = result.rows[0]
    const isPWMatch = await bcrypt.compare(password, realUserInfo.password);
    if(!isPWMatch) return res.status(401).send('Not authorized');
    const token = jwt.sign({id: realUserInfo.id, username: realUserInfo.username},process.env.JWT_SECRET);
    res.status(201).json(token);
  }catch(error){
    console.log('Could not log in',error)
  }
})

router.route("/me").get(verifyToken, async(req,res,next)=>{
const user = await getUserById(req.user.id)
res.status(200).send(user)

})