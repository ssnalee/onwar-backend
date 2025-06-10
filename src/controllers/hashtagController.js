import pool from '../db/pool.js';

export const getHashtagList = async (req, res) => {
    const hashtag_id = parseInt(req.query.hashtag_id, 10);
    try {
        let result;
        if(hashtag_id === 0){
            result = await pool.query('SELECT * FROM hashtags')
        }else{
            result = await pool.query(
                'SELECT * FROM hashtags WHERE id = $1',
                [hashtag_id]
            )
        }

        res.status(200).json({ error: false, data: result.rows, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}