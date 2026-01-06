import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * Cấu hình Swagger cho Express.js
 * 
 * Swagger là công cụ để tự động tạo tài liệu API dựa trên các comment JSDoc
 * trong code. Nó giúp:
 * - Tự động tạo UI để test API
 * - Tạo tài liệu API tự động
 * - Giúp frontend developer hiểu rõ API
 */

// Định nghĩa thông tin cơ bản về API
const swaggerDefinition = {
    openapi: '3.0.0', // Phiên bản OpenAPI (Swagger 3.0)
    info: {
        title: 'Cyber Community API', // Tên API
        version: '1.0.0', // Phiên bản API
        description: 'API documentation cho Cyber Community - Hệ thống quản lý cộng đồng',
        contact: {
            name: 'API Support',
            email: 'support@cybercommunity.com'
        }
    },
    servers: [
        {
            url: 'http://localhost:3069/api', // URL server
            description: 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Nhập JWT token để xác thực. Format: Bearer {token}'
            }
        },
        schemas: {
            // Schema cho response thành công
            SuccessResponse: {
                type: 'object',
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 200
                    },
                    message: {
                        type: 'string',
                        example: 'Thành công'
                    },
                    data: {
                        type: 'object'
                    }
                }
            },
            // Schema cho response lỗi
            ErrorResponse: {
                type: 'object',
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 400
                    },
                    message: {
                        type: 'string',
                        example: 'Lỗi xảy ra'
                    }
                }
            },
            // Schema cho User
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 1
                    },
                    email: {
                        type: 'string',
                        example: 'user@example.com'
                    },
                    name: {
                        type: 'string',
                        example: 'Nguyễn Văn A'
                    }
                }
            },
            // Schema cho Article
            Article: {
                type: 'object',
                properties: {
                    id: {
                        type: 'number',
                        example: 1
                    },
                    title: {
                        type: 'string',
                        example: 'Tiêu đề bài viết'
                    },
                    content: {
                        type: 'string',
                        example: 'Nội dung bài viết'
                    }
                }
            }
        }
    }
};

// Cấu hình options cho swagger-jsdoc
const options = {
    definition: swaggerDefinition,
    // Đường dẫn đến các file chứa JSDoc comments
    apis: [
        './src/routers/*.js', // Tất cả các file router
        './server.js' // File server chính
    ]
};

// Tạo swagger specification từ JSDoc comments
const swaggerSpec = swaggerJsdoc(options);

/**
 * Middleware để setup Swagger UI
 * @param {Express} app - Express app instance
 */
export const setupSwagger = (app) => {
    // Route để xem Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }', // Ẩn topbar
        customSiteTitle: 'Cyber Community API Documentation'
    }));

    // Route để lấy swagger.json (dùng cho các tool khác)
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('📚 Swagger UI available at: http://localhost:3069/api-docs');
};

export default swaggerSpec;

