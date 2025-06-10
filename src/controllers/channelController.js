import pool from '../db/pool.js';

export const getChannelList = async (req, res) => {
    try {
        console.log('Before DB query');
        const result = await pool.query(
            `SELECT 
                channel_posts.id,
                channel_posts.user_id,
                users.username,
                channel_posts.title,
                channel_posts.created_at,
                channel_posts.view_count,
                COUNT(channel_comments.id) AS comment_count
            FROM channel_posts
            JOIN users ON channel_posts.user_id = users.id
            LEFT JOIN channel_comments ON channel_comments.post_id = channel_posts.id
            GROUP BY 
                channel_posts.id,
                channel_posts.user_id,
                users.username,
                channel_posts.title,
                channel_posts.view_count,
                channel_posts.created_at
            ORDER BY channel_posts.id DESC
            `
        )
        console.log('After DB query');
        res.status(200).json({ error: false, data: result.rows, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const getChannelPost = async (req, res) => {
    const { post_id } = req.query;
    if (!post_id) {
        return res.status(400).json({ error: true, data: null, msg: "post_id가 존재하지 않습니다." });
    }
    try {
        const result = await pool.query(`
           SELECT channel_posts.*, users.username 
           FROM channel_posts
           JOIN users ON channel_posts.user_id = users.id  
           WHERE channel_posts.id = $1
        `, [post_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: true, data: null, msg: "해당 게시글이 없습니다." });
        }
        res.status(200).json({ error: false, data: result.rows[0], msg: "OK" });
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const postChannelPost = async (req, res) => {
    const user_id = req.user.userId;
    const { title, content } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: true, data: null, msg: '유저 아이디가 존재하지 않습니다.' });
    }
    if (!title || !content) {
        return res.status(400).json({ error: true, data: null, msg: '제목과 본문을 입력해주세요.' });
    }
    try {
        await pool.query(
            'INSERT INTO channel_posts (user_id, title, content) VALUES ($1, $2, $3)',
            [user_id, title, content]
        );
        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const patchChannelPost = async (req, res) => {
    const user_id = req.user.userId;
    const { post_id, title, content } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: true, data: null, msg: '유저 아이디가 존재하지 않습니다.' });
    }
    if (!title || !content) {
        return res.status(400).json({ error: true, data: null, msg: '제목과 본문을 입력해주세요.' });
    }
    try {
        const result = await pool.query(
            'UPDATE channel_posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4',
            [title, content, post_id, user_id]
        );
        if (result.rowCount === 0) {
            return res.status(403).json({ error: true, data: null, msg: '수정 권한이 없거나 데이터가 없습니다.' });
        }
        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const deleteChannelPost = async (req, res) => {
    const user_id = req.user.userId;
    const post_id = parseInt(req.params.post_id, 10);
    if (!user_id || !post_id) {
        return res.status(400).json({ error: true, data: null, msg: 'user_id, post_id 값이 존재하지 않습니다.' });
    }
    try {
        const result = await pool.query(
            'DELETE FROM channel_posts WHERE id = $1 AND user_id = $2',
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

export const getCommentList = async (req, res) => {
    const post_id = req.query.post_id;
    if (!post_id) {
        return res.status(400).json({ error: true, data: null, msg: 'post_id 값이 존재하지 않습니다.' });
    }
    try {
        const result = await pool.query(`
            SELECT channel_comments.*, users.username 
            FROM channel_comments
            JOIN users ON channel_comments.user_id = users.id 
            WHERE channel_comments.post_id = $1`
            , [post_id]
        )
        res.status(200).json({ error: false, data: result.rows, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const postChannelComment = async (req, res) => {
    const user_id = req.user.userId;
    const { post_id, content } = req.body;
    if (!user_id || !post_id) {
        return res.status(400).json({ error: true, data: null, msg: 'user_id, post_id 가 존재하지 않습니다.' });
    }
    if (!content) {
        return res.status(400).json({ error: true, data: null, msg: '댓글을 입력해주세요.' });
    }
    try {
        await pool.query(
            'INSERT INTO channel_comments (user_id, post_id, content) VALUES ($1, $2, $3)',
            [user_id, post_id, content]
        );
        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const patchChannelComment = async (req, res) => {
    const user_id = req.user.userId;
    const { comment_id, content } = req.body;
    if (!user_id || !comment_id) {
        return res.status(400).json({ error: true, data: null, msg: 'user_id, comment_id 가 존재하지 않습니다.' });
    }
    if (!content) {
        return res.status(400).json({ error: true, data: null, msg: '댓글을 입력해주세요.' });
    }
    try {
        const result = await pool.query(
            'UPDATE channel_comments SET content = $1 WHERE id = $2 AND user_id = $3',
            [content, comment_id, user_id]
        );
        if (result.rowCount === 0) {
            return res.status(403).json({ error: true, data: null, msg: '수정 권한이 없거나 데이터가 없습니다.' });
        }
        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const deleteChannelComment = async (req, res) => {
    const user_id = req.user.userId;
    const comment_id = parseInt(req.params.comment_id,10);
    if (!user_id || !comment_id) {
        return res.status(400).json({ error: true, data: null, msg: 'user_id, comment_id 값이 존재하지 않습니다.' });
    }
    try {
        const result = await pool.query(
            'DELETE FROM channel_comments WHERE id = $1 AND user_id = $2',
            [comment_id, user_id]
        );
        if (result.rowCount === 0) {
            return res.status(403).json({ error: true, data: null, msg: '삭제 권한이 없거나 데이터가 없습니다.' });
        }
        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const channelViewCount = async (req, res) => {
    const post_id = parseInt(req.params.post_id, 10);
    if (!post_id) {
        return res.status(400).json({ error: true, data: null, msg: 'post_id가 필요합니다.' });
    }

    // 중복 조회 방지를 위한 쿠키명, 예: viewed_post_123
    const cookieName = `viewed_channel_${post_id}`;

    if (!req.cookies[cookieName]) {
        // 쿠키 없으면 조회수 증가 처리
        try {
            await pool.query(
                'UPDATE channel_posts SET view_count = view_count + 1 WHERE id = $1',
                [post_id]
            );

            // 쿠키 설정: 1일간 조회 중복 방지
            res.cookie(cookieName, 'true', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        } catch (err) {
            return res.status(500).json({ error: true, data: null, msg: '서버 에러' });
        }
    }
    res.status(200).json({ error: false, data: null, msg: '조회수 반영 완료' });
};
