import pool from '../db/pool.js';

export const getChannelList = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                channel_posts.id,
                channel_posts.user_id,
                users.username,
                channel_posts.title,
                channel_posts.created_at,
                COUNT(channel_comments.id) AS comment_count
            FROM channel_posts
            JOIN users ON channel_posts.user_id = users.id
            LEFT JOIN channel_comments ON channel_comments.post_id = channel_posts.id
            GROUP BY 
                channel_posts.id,
                channel_posts.user_id,
                users.username,
                channel_posts.title,
                channel_posts.created_at
            ORDER BY channel_posts.id DESC
            `
        )
        res.status(200).json({ error: false, data: result.rows, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const getChannelItem = async (req, res) => {
    const { post_id } = req.query;
    if (!post_id) {
        return res.status(400).json({ error: true, data: null, msg: "post_id가 존재하지 않습니다." });
    }
    try {
        const result = await pool.query(`
           SELECT * FROM channel_posts where id = $1
        `, [post_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: true, data: null, msg: "해당 게시글이 없습니다." });
        }
        res.status(200).json({ error: false, data: result.rows[0], msg: "OK" });
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}