import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

console.log('process.env.DATABASE_URL',process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// 예시 라우터
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.send(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});     