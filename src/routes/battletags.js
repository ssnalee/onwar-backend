import express from 'express';
import { deleteBattletag, getBattletagList, patchBattletag, postBattletag } from '../controllers/battletagController.js';
const router = express.Router();

/**
 * @swagger
 * /battletags/list:
 *   get:
 *     summary: 특정 유저의 배틀태그 목록 조회
 *     tags: [Battletags]
 *     responses:
 *       200:
 *         description: 배틀태그 목록 조회 성공
 *       400:
 *         description: user_id가 없을 경우
 *       500:
 *         description: 서버 에러 발생
 */

router.get('/list', getBattletagList);

/**
 * @swagger
 * /battletags:
 *   post:
 *     summary: 배틀태그 등록
 *     tags: [Battletags]
 *     parameters:
 *       - in: query
 *         name: battletag
 *         schema:
 *           type: string
 *         required: true
 *         description: 등록할 배틀태그
 *     responses:
 *       200:
 *         description: 배틀태그 등록 성공
 *       400:
 *         description: 필수 정보 누락
 *       500:
 *         description: 서버 에러
 */

router.post('/', postBattletag);

/**
 * @swagger
 * /battletags:
 *   patch:
 *     summary: 배틀태그 수정
 *     tags: [Battletags]
 *     parameters:
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 수정할 배틀태그의 ID
 *       - in: query
 *         name: battletag
 *         schema:
 *           type: string
 *         required: true
 *         description: 수정할 배틀태그 내용
 *     responses:
 *       200:
 *         description: 배틀태그 수정 성공
 *       400:
 *         description: 필수 정보 누락
 *       403:
 *         description: 권한 없음 또는 데이터 없음
 *       500:
 *         description: 서버 에러
 */
router.patch('/', patchBattletag);

/**
 * @swagger
 * /battletags:
 *   delete:
 *     summary: 배틀태그 삭제
 *     tags: [Battletags]
 *     description: 특정 유저가 본인의 배틀태그를 삭제합니다.
 *     parameters:
 *       - in: query
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 배틀태그 ID (삭제할 항목의 ID)
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       400:
 *         description: 요청 파라미터 오류
 *       403:
 *         description: 권한 없음 또는 데이터 없음
 *       500:
 *         description: 서버 에러
 */
router.delete('/', deleteBattletag);

export default router;