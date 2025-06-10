import express from 'express';
import userRoutes from './users.js';
import battleTagRoutes from './battletags.js';
import channelRoutes from './channels.js';
import postRoutes from './posts.js';
import { authenticateToken } from './../middlewares/auth.js';
import pool from '../db/pool.js';
/**
 * 개별 routes 파일 불러와서 /api 하위 경로로 연결
 */

const router = express.Router();


router.use('/users', userRoutes);
router.use('/battletags', authenticateToken, battleTagRoutes);
router.use('/channels', channelRoutes);
router.use('/board', postRoutes); 

router.get('/', (req, res) => {
  res.send('RUNNING API');
});
router.get('/health', (req, res) => {
  res.status(200).send('OK');
});
router.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT now();');
    res.status(200).json({ time: result.rows[0].now });
  } catch (err) {
    console.error('DB 연결 실패:', err);
    res.status(500).json({ error: 'DB 연결 실패' });
  }
});
export default router;
