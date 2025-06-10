import express from 'express';
import { getChannelItem, getChannelList } from '../controllers/channelController.js';
const router = express.Router();

/**
 * @swagger
 * /channels/list:
 *   get:
 *     summary: 모든 채널 포스트 조회
 *     tags: [Channels]
 *     responses:
 *       200:
 *         description: 채널 포스트 목록 조회 성공
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
 *                       channel_id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 msg:
 *                   type: string
 *       500:
 *         description: 서버 에러 발생
 */
router.get('/list', getChannelList);

/**
 * @swagger
 * /channels/item:
 *   get:
 *     summary: 특정 채널 포스트 조회
 *     tags: [Channels]
 *     description: post_id로 단일 게시글 정보를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 게시글 ID
 *     responses:
 *       200:
 *         description: 정상 조회
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 10
 *                     title:
 *                       type: string
 *                       example: "게시글 제목"
 *                     content:
 *                       type: string
 *                       example: "게시글 내용"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-09T10:00:00Z"
 *                 msg:
 *                   type: string
 *                   example: "OK"
 *       400:
 *         description: post_id가 없을 때
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 게시글이 없을 때
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 */
router.get('/item', getChannelItem);

export default router;