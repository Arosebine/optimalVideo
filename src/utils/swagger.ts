import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocs = (app: Express) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Video Metadata API',
                version: '1.0.0',
                description: 'API for managing video metadata',
            },
        },
        apis: ['./src/routes/*.ts'],
    };

    const specs = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default swaggerDocs;
