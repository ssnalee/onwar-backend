import express from 'express';
import { boardViewCount, deleteBoardComment, deleteBoardPost, getBoardList, patchBoardComment, patchBoardPost, postBoardComment, postBoardPost } from '../controllers/postController.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = express.Router();
/**
 * @swagger
 * /board/posts:
 *   get:
 *     summary: 게시글 목록 조회
 *     description: 선택적으로 category(1 또는 2)를 쿼리 파라미터로 전달하여 카테고리별 게시글을 조회할 수 있습니다.
 *     tags:
 *       - [Board]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         required: false
 *         description: 필터링할 게시글 카테고리 (1 또는 2)
 *     responses:
 *       200:
 *         description: 게시글 목록 성공 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       post_id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 42
 *                       battletag:
 *                         type: string
 *                         example: "Player#1234"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-10T14:30:00Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-10T15:00:00Z"
 *                       category:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "user123"
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 101
 *                             content:
 *                               type: string
 *                               example: "좋은 글이네요!"
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                             updated_at:
 *                               type: string
 *                               format: date-time
 *                             username:
 *                               type: string
 *                               example: "commenter42"
 *                       hashtags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["게임", "오버워치", "팀플레이"]
 *                 msg:
 *                   type: string
 *                   example: "OK"
 *       500:
 *         description: 서버 에러 발생
 */

router.get('/posts', getBoardList);

/**
 * @swagger
 * /board/post:
 *   post:
 *     summary: 게시글 작성
 *     description: 게시글을 작성하고, 선택된 해시태그들과 함께 저장합니다.
 *     tags:
 *       - [Board]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               battletag:
 *                 type: string
 *                 example: "Player#1234"
 *               hashtag_list:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 5]
 *               category:
 *                 type: integer
 *                 enum: [1, 2]
 *                 example: 1
 *     responses:
 *       200:
 *         description: 게시글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                 msg:
 *                   type: string
 *                   example: "OK"
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                 msg:
 *                   type: string
 *                   example: "배틀태그와 해시태그를 입력해주세요."
 *       500:
 *         description: 서버 에러 발생
 */

router.post('/post', authenticateToken, postBoardPost);

/**
 * @swagger
 * /board/post:
 *   patch:
 *     summary: 게시글 수정 (배틀태그 및 해시태그 업데이트)
 *     tags:
 *       - [Board]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *               - battletag
 *               - hashtag_list
 *             properties:
 *               post_id:
 *                 type: integer
 *                 example: 123
 *               battletag:
 *                 type: string
 *                 example: "Player#5678"
 *               hashtag_list:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *       400:
 *         description: 잘못된 요청 (필수 데이터 누락)
 *       403:
 *         description: 권한 없음 또는 데이터 없음
 *       500:
 *         description: 서버 에러
 */
router.patch('/post', authenticateToken, patchBoardPost);
/**
 * @swagger
 * /board/post/{post_id}:
 *   delete:
 *     summary: 게시글 삭제
 *     description: 로그인한 사용자가 본인 게시글을 삭제합니다.
 *     tags:
 *       - [Board]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: 삭제할 게시글 ID
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       400:
 *         description: user_id 또는 post_id가 없을 때
 *       403:
 *         description: 삭제 권한이 없거나 데이터가 없는 경우
 *       500:
 *         description: 서버 에러 발생
 */
router.delete('/post/:post_id', authenticateToken, deleteBoardPost);

/**
 * @swagger
 * /board/comment:
 *   post:
 *     summary: 댓글 작성
 *     description: 게시글에 댓글을 작성합니다.
 *     tags:
 *       - [Board]
 *     security:
 *       - bearerAuth: []
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
 *                 description: 댓글을 작성할 게시글 ID
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 작성 성공
 *       400:
 *         description: 필수 값 누락
 *       500:
 *         description: 서버 에러
 */
router.post('/comment', authenticateToken, postBoardComment);

/**
 * @swagger
 * /board/comment:
 *   patch:
 *     summary: 댓글 수정
 *     description: 사용자가 작성한 댓글을 수정합니다.
 *     tags:
 *       - [Board]
 *     security:
 *       - bearerAuth: []
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
 *                 description: 수정할 댓글 ID
 *               content:
 *                 type: string
 *                 description: 수정할 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *       400:
 *         description: 필수 값 누락
 *       403:
 *         description: 권한 없음 또는 댓글 없음
 *       500:
 *         description: 서버 에러
 */
router.patch('/comment', authenticateToken, patchBoardComment);

/**
 * @swagger
 * /board/comment/{comment_id}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 사용자가 본인의 댓글을 삭제합니다.
 *     tags:
 *       - [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         description: 삭제할 댓글 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 삭제 성공
 *       400:
 *         description: user_id 또는 comment_id 누락
 *       403:
 *         description: 삭제 권한이 없거나 댓글이 존재하지 않음
 *       500:
 *         description: 서버 에러 발생
 */
router.delete('/comment/:comment_id', authenticateToken, deleteBoardComment);

/**
 * @swagger
 * /board/post/{post_id}/view:
 *   put:
 *     summary: 게시글 조회수 증가
 *     description: 쿠키를 이용해 중복 조회수 증가를 방지합니다.
 *     tags:
 *       - [Board]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회수를 증가시킬 게시글 ID
 *     responses:
 *       200:
 *         description: 조회수 반영 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: 조회수 반영 완료
 *       400:
 *         description: 잘못된 요청 (post_id 누락 등)
 *       500:
 *         description: 서버 에러 발생
 */

router.put('/post/:post_id/view', boardViewCount);

export default router;