import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { Client } from 'pg';

// Original server.js file content is below 

import app from "#app";
import db from "#db/client";

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
