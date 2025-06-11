import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'Express API with Swagger docs',
        },
        servers: [
            {
                url: `${process.env.BACK_URL}/api`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {      // 이름은 마음대로
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],   // 모든 API에 전역 적용
            },
        ],
    },
    apis: ['./src/routes/*.js'], // 주석 기반 문서화할 파일 경로
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;