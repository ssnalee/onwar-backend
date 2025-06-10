import express from 'express';
import userRoutes from './users.js';
import battleTagRoutes from './battletags.js';
import channelRoutes from './channels.js';
// import postRoutes from './posts.js'; // 추가할 수도 있음
import { authenticateToken } from './../middlewares/auth.js';

/**
 * 개별 routes 파일 불러와서 /api 하위 경로로 연결
 */

const router = express.Router();


router.use('/users', userRoutes);
router.use('/battletags', authenticateToken, battleTagRoutes);
router.use('/channels', channelRoutes);

// router.use('/posts', postRoutes); // 필요시 추가

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

export default router;
