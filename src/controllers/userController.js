import pool from '../db/pool.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * DB 호출 등 실제 로직 처리
 * 요청 - 응답 처리 
 */

/**
 * @route GET /api/users/check-id
 * @summary 중복 아이디 확인
 * @param {username} req 
 * @returns 
 */

export const checkUsernameExists = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: true, data: null, msg: '아이디를 입력해주세요.' });
    }

    const isValid = /^[a-zA-Z0-9]{4,12}$/.test(username);
    if (!isValid) {
        return res.status(400).json({ error: true, data: null, msg: '아이디는 4~12자의 영어와 숫자만 가능합니다.' });
    }

    try {
        const result = await pool.query(
            'SELECT 1 FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1',
            [username]
        );

        res.status(200).json({ error: false, data: { isExist: result.rowCount > 0 }, msg: "OK" })
    } catch (err) {
        console.error('DB error :', err);
        res.status(500).json({ error: true, data: null, msg: "서버 에러 발생" })
    }
}

/**
 * @route GET /api/users/sign-in
 * @summary 회원가입
 * @param {username , password, confirm_password} req 
 * @returns 
 */

export const signupUser = async (req, res) => {
    const { username, password, confirm_password} = req.body;
    if (!username || !password || !confirm_password) {
        return res.status(400).json({ error: true, data: null, msg: '아이디와 비밀번호를 입력해주세요.' });
    }
    const isValidUsername = /^[a-zA-Z0-9]{4,12}$/.test(username);
    if (!isValidUsername) {
        return res.status(400).json({ error: true, data: null, msg: '아이디는 4~12자의 영어와 숫자만 가능합니다.' });
    }
    if(password !== confirm_password){
        return res.status(400).json({ error: true, data: null, msg: '동일한 비밀번호를 입력하세요.' });
    }

    try {
        // 중복 아이디 확인
        const dup = await pool.query(
            'SELECT 1 FROM users WHERE LOWER(username) = LOWER($1)',
            [username]
        );
        if (dup.rowCount > 0) {
            return res.status(409).json({ error: true, data: null, msg: "이미 사용 중인 아이디입니다." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.query('INSERT INTO users (username, password) VALUES ($1,$2)',
            [username, hashedPassword]
        );
        res.status(201).json({error:false,data:null,msg:'OK'});
    } catch(err){
        res.status(500).json({error:true, data:null,msg:"서버 에러 발생"})
    }
}

/**
 * @route GET /api/users/login
 * @summary 회원가입
 * @param {username , password} req 
 * @returns 
 */

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({error:true,data:null,msg:'아이디와 비밀번호를 입력해주세요.'});
    }
    try{
        const result = await pool.query(
            'select * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1',
            [username]
        );
        if(result.rowCount === 0){
            return res.status(401).json({error:true,data:null,msg:"존재하지 않는 아이디입니다."});
        }
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({error:true,data: null, msg: "비밀번호가 일치하지 않습니다."});
        }

        const payload = {
            userId: user.id,
            username: user.username,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : '1h'});
        res.status(200).json({error:false, data:{
            id : user.id,
            username : user.username,
            accessToken : token,
        }})

    } catch(err){
        res.status(500).json({error:true, data:null,msg:"서버 에러 발생"})
    }
}