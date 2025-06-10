import express from 'express';
import { getChannelPost, getChannelList, postChannelPost, patchChannelPost, deleteChannelPost, getCommentList, postChannelComment, patchChannelComment, deleteChannelComment } from '../controllers/channelController.js';
import { authenticateToken } from './../middlewares/auth.js';
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
 *       500:
 *         description: 서버 에러 발생
 */
router.get('/list', getChannelList);

/**
 * @swagger
 * /channels/post:
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
 *       400:
 *         description: post_id가 없을 때
 *       404:
 *         description: 게시글이 없을 때
 *       500:
 *         description: 서버 에러
 *
 */
router.get('/post', getChannelPost);

/**
 * @swagger
 * /channels/post:
 *   post:
 *     summary: 채널 게시글 작성
 *     tags: [Channels]
 *     description: 제목과 내용을 입력하여 새 채널 게시글을 작성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "새 게시글 제목"
 *               content:
 *                 type: string
 *                 example: "게시글 본문입니다."
 *     responses:
 *       200:
 *         description: 작성 성공
 *       400:
 *         description: 유효하지 않은 요청
 *       500:
 *         description: 서버 에러
 */
router.post('/post', authenticateToken, postChannelPost);

/**
 * @swagger
 * /channels/post:
 *   patch:
 *     summary: 채널 게시글 수정
 *     tags: [Channels]
 *     description: post_id, 제목, 내용을 전달받아 게시글을 수정합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *               - title
 *               - content
 *             properties:
 *               post_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "수정된 제목"
 *               content:
 *                 type: string
 *                 example: "수정된 본문 내용"
 *     responses:
 *       200:
 *         description: 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       403:
 *         description: 권한 없음 또는 존재하지 않는 데이터
 *       500:
 *         description: 서버 에러
 */
router.patch('/post', authenticateToken, patchChannelPost);

/**
 * @swagger
 * /channels/post:
 *   delete:
 *     summary: 채널 게시글 삭제
 *     tags: [Channels]
 *     description: post_id를 전달받아 게시글을 삭제합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *             properties:
 *               post_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       400:
 *         description: 유효하지 않은 요청
 *       403:
 *         description: 권한 없음 또는 존재하지 않는 데이터
 *       500:
 *         description: 서버 에러
 */
router.delete('/post', authenticateToken, deleteChannelPost);

/**
 * @swagger
 * /channels/comments:
 *   get:
 *     summary: 채널 댓글 목록 조회
 *     tags: [Channels]
 *     description: 특정 게시글(post_id)의 댓글 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 조회 성공
 *       400:
 *         description: post_id 누락
 *       500:
 *         description: 서버 에러
 */
router.get('/comments', getCommentList);

/**
 * @swagger
 * /channels/comment:
 *   post:
 *     summary: 채널 댓글 작성
 *     tags: [Channels]
 *     description: post_id와 content를 입력받아 댓글을 작성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *               - content
 *             properties:
 *               post_id:
 *                 type: integer
 *                 example: 10
 *               content:
 *                 type: string
 *                 example: "댓글 내용입니다."
 *     responses:
 *       200:
 *         description: 작성 성공
 *       400:
 *         description: 유효하지 않은 요청 (필수값 누락)
 *       500:
 *         description: 서버 에러
 */
router.post('/comment', authenticateToken, postChannelComment);

/**
 * @swagger
 * /channels/comment:
 *   patch:
 *     summary: 채널 댓글 수정
 *     tags: [Channels]
 *     description: comment_id와 content를 입력받아 본인의 댓글을 수정합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment_id
 *               - content
 *             properties:
 *               comment_id:
 *                 type: integer
 *                 example: 3
 *               content:
 *                 type: string
 *                 example: "수정된 댓글입니다."
 *     responses:
 *       200:
 *         description: 수정 성공
 *       400:
 *         description: 필수값 누락
 *       403:
 *         description: 권한 없음 또는 데이터 없음
 *       500:
 *         description: 서버 에러
 */
router.patch('/comment', authenticateToken, patchChannelComment);

/**
 * @swagger
 * /channels/comments:
 *   delete:
 *     summary: 채널 댓글 삭제
 *     tags: [Channels]
 *     description: comment_id를 전달받아 본인의 댓글을 삭제합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment_id
 *             properties:
 *               comment_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       400:
 *         description: 필수값 누락
 *       403:
 *         description: 권한 없음 또는 데이터 없음
 *       500:
 *         description: 서버 에러
 */
router.delete('/comment', authenticateToken, deleteChannelComment);



export default router;