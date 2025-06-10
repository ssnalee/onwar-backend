import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) =>{
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    
    if(!token){
        return res.status(401).json({error:true,content:null,msg:"접근 권한이 없습니다."});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err){
            console.log('jwt error:', err);
            return res.status(403).json({error:true,content:null,msg:"토큰이 유효하지 않습니다."});
        }
        req.user = user;
        next();
    })
}
