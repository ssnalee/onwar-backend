import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';

/**
 * 미들웨어 설정 (express.json)
 * 라우터 등록
 * 서버 listen 설정
 */

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router); // 모든 API는 /api로 시작하게 설정
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});