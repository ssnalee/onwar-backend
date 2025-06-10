import express from 'express';
import {  checkUsernameExists, loginUser, signupUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * /users/check-id:
 *   get:
 *     summary: 아이디 중복 확인
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 중복 여부 반환
 *         content:
 *           application/json:
 *             example:
 *               error : false            
 *               data : { exists: true }
 *               msg : 'OK'
 */
router.get('/check-id', checkUsernameExists);

/**
 * @swagger
 * /users/sign-up:
 *   post:
 *     summary: 회원가입
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: testpass123
 *               confirm_password:
 *                 type: string
 *                 example: testpass123
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       400:
 *         description: 요청 형식 오류
 *       409:
 *         description: 중복된 아이디
 */
router.post('/sign-up', signupUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: 로그인
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: testpass123
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: testuser
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 msg:
 *                   type: string
 *                   example: ""
 *       400:
 *         description: 아이디 또는 비밀번호 누락
 *       401:
 *         description: 로그인 실패 (아이디 없거나 비밀번호 불일치)
 *       500:
 *         description: 서버 에러
 */
router.post('/login', loginUser);


export default router;