import pool from '../db/pool.js';

export const getBoardList = async (req, res) => {
    const category = parseInt(req.query.category, 10);
    try {
        //JSON_BUILD_OBJECT : ()안에 있는 레코드를 JSON 객체 형태로 만듬
        //JSON_BUILD_OBJECT('id', comments.id) => { "id" : 4 }
        //JSON_AGG : 여러 개의 JSON 객체를 배열로 만듬
        //JSON_AGG(JSON_BUILD_OBJECT()) => [{"id" : 4 },{...}]
        //FILTER (WHERE comments.id IS NOT NULL)
        //LEFT JOIN 할 때 댓글이 없는 경우 comments.id 가 null이 되는데
        //이 필터를 넣음으로써, null값은 배열에 포함되지 않게 함
        //comments.id 가 null인 행을 집계 대상에서 제외
        //COALESCE(...,'[]') 첫번째 인자가 NULL이면 두번째 인자를 반환
        //JSON_AGG가 댓글이 하나도 없으면 NULL 반환 대신 빈배열 반환
        //JSON_AGG 자체가 집계할 행이 하나도 없으면 NULL을 반환함
        //1. 댓글이 아예 없는 게시글은 FILTER 때문에 집계 대상이 없고,
        //2. JSON_AGG가 NULL을 리턴하는 상황이 생김
        //3. 이 때, COALESCE 가 NULL을 [] 로 대체함

        const result = await pool.query(
            `SELECT 
                posts.id as post_id,
                posts.user_id,
                posts.battletag,
                posts.created_at,
                posts.updated_at,
                posts.view_count,
                users.username,
                (
                    SELECT COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', c.id,
                                'content', c.content,
                                'created_at', c.created_at,
                                'updated_at', c.updated_at,
                                'username', u.username
                            )
                        ), '[]'::json
                    )
                    FROM comments c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.post_id = posts.id
                ) AS comments,
                (
                    SELECT COALESCE(
                        JSON_AGG(DISTINCT h.tag), '[]'::json
                    )
                    FROM post_hashtags ph
                    JOIN hashtags h ON h.id = ph.hashtag_id
                    WHERE ph.post_id = posts.id
                ) AS hashtags
                FROM posts
                JOIN users ON posts.user_id = users.id
                WHERE posts.category = $1
                ORDER BY posts.id DESC;
            `, [category]
        )
        res.status(200).json({ error: false, data: result.rows, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const postBoardPost = async (req, res) => {
    const user_id = req.user.userId;
    const { battletag, hashtag_list, category } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: true, data: null, msg: '유저 아이디가 존재하지 않습니다.' });
    }
    if (!battletag || !Array.isArray(hashtag_list) ||
        category !== 1 && category !== 2) {
        return res.status(400).json({ error: true, data: null, msg: '배틀태그와 해시태그, 카테고리를 입력해주세요.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO posts (user_id, battletag, category) VALUES ($1, $2, $3) RETURNING *',
            [user_id, battletag, category]
        );
        const post_id = result.rows[0].id;
        for (const hashtag_id of hashtag_list) {
            await pool.query(
                'INSERT INTO post_hashtags (post_id, hashtag_id) VALUES ($1, $2)',
                [post_id, hashtag_id]
            )
        }

        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const patchBoardPost = async (req, res) => {
    const user_id = req.user.userId;
    const { post_id, battletag, hashtag_list } = req.body;
    if (!user_id || !post_id) {
        return res.status(400).json({ error: true, data: null, msg: 'user_id, post_id가 존재하지 않습니다.' });
    }
    if (!battletag || !Array.isArray(hashtag_list)) {
        return res.status(400).json({ error: true, data: null, msg: '배틀태그와 해시태그를 입력해주세요.' });
    }
    try {
        const result = await pool.query(
            'UPDATE posts SET battletag = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [battletag, post_id, user_id]
        );
        if (result.rowCount === 0) {
            return res.status(403).json({ error: true, data: null, msg: '수정 권한이 없거나 데이터가 없습니다.' });
        }
        const deleteResult = await pool.query(
            `DELETE FROM post_hashtags WHERE post_id = $1`,
            [post_id]
        );
        if (deleteResult.rowCount === 0) {
            return res.status(403).json({ error: true, data: null, msg: '배틀태그 삭제 권한이 없거나 데이터가 없습니다.' });
        }
        for (const hashtag_id of hashtag_list) {
            await pool.query(
                'INSERT INTO post_hashtags (post_id, hashtag_id) VALUES ($1, $2)',
                [post_id, hashtag_id]
            )
        }
        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const deleteBoardPost = async (req, res) => {
    const user_id = req.user.userId;
    const post_id = parseInt(req.params.post_id, 10);
    if (!user_id || !post_id) {
        return res.status(400).json({ error: true, data: null, msg: 'user_id, post_id 값이 존재하지 않습니다.' });
    }
    try {
        const result = await pool.query(
            'DELETE FROM posts WHERE id = $1 AND user_id = $2',
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

export const postBoardComment = async (req, res) => {
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
            'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)',
            [user_id, post_id, content]
        );
        res.status(200).json({ error: false, data: null, msg: "OK" })
    } catch (err) {
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" });
    }
}

export const patchBoardComment = async (req, res) => {
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
            'UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3',
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

export const deleteBoardComment = async (req, res) => {
    const user_id = req.user.userId;
    const comment_id = parseInt(req.params.comment_id, 10);
    if (!user_id || !comment_id) {
        return res.status(400).json({ error: true, data: null, msg: 'user_id, comment_id 값이 존재하지 않습니다.' });
    }
    try {
        const result = await pool.query(
            'DELETE FROM comments WHERE id = $1 AND user_id = $2',
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

export const boardViewCount = async (req, res) => {
    const post_id = parseInt(req.params.post_id, 10);
    if (!post_id) {
        return res.status(400).json({ error: true, data: null, msg: 'post_id가 필요합니다.' });
    }

    // 중복 조회 방지를 위한 쿠키명, 예: viewed_post_123
    const cookieName = `viewed_post_${post_id}`;

    if (!req.cookies[cookieName]) {
        // 쿠키 없으면 조회수 증가 처리
        try {
            await pool.query(
                'UPDATE posts SET view_count = view_count + 1 WHERE id = $1',
                [post_id]
            );

            // 쿠키 설정: 1일간 조회 중복 방지 // 테스트 5분
            // res.cookie(cookieName, 'true', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
            res.cookie(cookieName, 'true', { maxAge: 5 * 60 * 1000, httpOnly: true });
        } catch (err) {
            return res.status(500).json({ error: true, data: null, msg: '서버 에러' });
        }
    }
    res.status(200).json({ error: false, data: null, msg: '조회수 반영 완료' });
};

// fetch('/api/posts/123/view', {
//     method: 'POST', // 또는 GET/PUT 등 원하는 메소드
//     credentials: 'include', // 쿠키 포함해서 요청 보내기
//   });