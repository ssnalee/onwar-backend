import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
/**
 * 미들웨어 설정 (express.json)
 * 라우터 등록
 * 서버 listen 설정
 */

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Process Port : ${process.env.PORT}`);
    console.log(`DATABASE_URL : ${process.env.DATABASE_URL}`);
});