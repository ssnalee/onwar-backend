import pool from '../db/pool.js';

/**
 * @route GET /api/battletags/list
 * @summary 특정 유저의 배틀태그 목록 조회
 * @returns 
 */

export const getBattletagList = async (req, res) => {
    const user_id = req.user.userId;

    if (!user_id) {
        return res.status(400).json({ error: true, data: null, msg: '유저 아이디가 존재하지 않습니다.' });
    }
    try {
        const result = await pool.query(
            'SELECT battletag,id FROM battletags WHERE user_id = $1',
            [user_id]
        )
        res.status(200).json({ error: false, data: result.rows, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const postBattletag = async (req, res) => {
    const user_id = req.user.userId;
    const { battletag } = req.query;
    if (!user_id || !battletag) {
        return res.status(400).json({ error: true, data: null, msg: '유저 아이디가 존재하지 않습니다.' });
    }
    const regex = /^[A-Za-z]+#[0-9]+$/;
    if (!regex.test(battletag)) {
        return res.status(400).json({ error: true, msg: '배틀태그 형식이 올바르지 않습니다.' });
    }
    if (battletag.length > 20) {
        return res.status(400).json({ error: true, msg: '배틀태그는 최대 20자까지 가능합니다.' });
    }

    try {
        await pool.query(
            'INSERT INTO battletags (user_id, battletag) VALUES ($1, $2)',
            [user_id, battletag]
        )

        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const patchBattletag = async (req, res) => {
    const user_id = req.user.userId;
    const post_id = req.query.post_id;
    const { battletag } = req.query;
    if (!user_id || !post_id || !battletag) {
        return res.status(400).json({ error: true, data: null, msg: '유저 아이디가 존재하지 않습니다.' });
    }
    const regex = /^.+#[0-9]+$/;
    if (!regex.test(battletag)) {
        return res.status(400).json({ error: true, msg: '배틀태그 형식이 올바르지 않습니다.' });
    }
    if (battletag.length > 20) {
        return res.status(400).json({ error: true, msg: '배틀태그는 최대 20자까지 가능합니다.' });
    }
    
    try {
        const result = await pool.query(
            'UPDATE battletags  SET battletag = $1 WHERE id = $2 AND user_id = $3',
            [battletag, post_id, user_id]
        );
        if (result.rowCount === 0) {
            return res.status(403).json({ error: true, data: null, msg: '수정 권한이 없거나 데이터가 없습니다.' });
        }
        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const deleteBattletag = async (req, res) => {
    const user_id = req.user.userId;
    // const post_id = parseInt(req.query.post_id, 10);
    const post_id = req.query.post_id;
    if (!user_id || !post_id) {
        return res.status(400).json({ error: true, data: null, msg: '유저 아이디가 존재하지 않습니다.' });
    }
    try {
        const result = await pool.query(
            'DELETE FROM battletags WHERE id = $1 AND user_id = $2',
            [post_id, user_id]
        );
        if (result.rowCount === 0) {
            return res.status(403).json({ error: true, data: null, msg: '삭제 권한이 없거나 데이터가 없습니다.' });
        }
        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}