import express from 'express';
import userRoutes from './users.js';
import battleTagRoutes from './battletags.js';
import channelRoutes from './channels.js';
import postRoutes from './posts.js';
import { authenticateToken } from './../middlewares/auth.js';

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

export default router;
