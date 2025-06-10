import express from 'express';
import { getHashtagList } from '../controllers/hashtagController.js';
const router = express.Router();

/**
 * @swagger
 * /hashtags/list:
 *   get:
 *     summary: 해시태그 목록 조회
 *     tags: [Hashtags]
 *     description: hashtag_id 쿼리 파라미터에 따라 특정 해시태그 또는 전체 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: hashtag_id
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: 조회할 해시태그 ID (0이면 전체 조회)
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                 msg:
 *                   type: string
 *       500:
 *         description: 서버 에러 발생
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: null
 *                 msg:
 *                   type: string
 */
router.get('/list', getHashtagList);

export default router;
