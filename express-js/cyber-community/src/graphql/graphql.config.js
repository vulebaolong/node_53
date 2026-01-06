/**
 * ============================================
 * GRAPHQL CONFIG - CẤU HÌNH GRAPHQL CHO EXPRESS
 * ============================================
 * 
 * File này setup GraphQL endpoint và GraphiQL (tool để test GraphQL)
 */

// Import graphqlHTTP middleware từ express-graphql
// graphqlHTTP: Middleware xử lý GraphQL requests
// Nó sẽ tự động:
//   1. Parse GraphQL query từ request body
//   2. Validate query theo schema
//   3. Execute query bằng cách gọi resolvers
//   4. Trả về JSON response
import { graphqlHTTP } from 'express-graphql';

// Import schema và root resolvers
// schema: GraphQL schema đã được build từ string
// root: Object chứa các resolver functions
import { schema, root } from './schema/article.schema.js';

/**
 * setupGraphQL - Hàm để setup GraphQL endpoint
 * 
 * @param {Express} app - Express app instance
 * 
 * Flow:
 * 1. Tạo endpoint /graphql
 * 2. Setup graphqlHTTP middleware
 * 3. Pass schema và resolvers vào middleware
 * 4. Bật GraphiQL UI để test
 */
export const setupGraphQL = (app) => {
    /**
     * Tạo endpoint /graphql để nhận các GraphQL queries và mutations
     * 
     * app.use('/graphql', ...): Tạo route /graphql
     * Tất cả requests đến /graphql sẽ được xử lý bởi GraphQL middleware
     */
    app.use('/graphql', graphqlHTTP({
        // schema: GraphQL schema đã được build
        // Middleware dùng schema để validate queries
        schema: schema,
        
        // rootValue: Object chứa các resolver functions
        // Middleware dùng root để tìm và gọi resolver tương ứng
        // Ví dụ: query "articles" → gọi root.articles()
        rootValue: root,
        
        // graphiql: true - Bật GraphiQL UI
        // GraphiQL: Tool để test GraphQL trong browser
        // Truy cập: http://localhost:3069/graphql
        // Cho phép viết và test queries trực tiếp trên browser
        graphiql: true,
        
        // customFormatErrorFn: Custom function để format error messages
        // Được gọi khi có lỗi xảy ra trong quá trình xử lý query
        customFormatErrorFn: (error) => {
            // Log lỗi ra console để debug
            console.error('🔴 GraphQL Error:', error);
            console.error('Error message:', error.message);
            console.error('Error path:', error.path);
            
            // Trả về object chứa thông tin lỗi
            return {
                message: error.message,        // Message lỗi
                locations: error.locations,    // Vị trí lỗi trong query (line, column)
                path: error.path,              // Path của field bị lỗi (ví dụ: ['articles'])
                stack: error.stack             // Stack trace (để debug)
            };
        }
    }));
    
    // Log thông báo GraphQL đã được setup thành công
    console.log('🚀 GraphQL endpoint available at: http://localhost:3069/graphql');
    console.log('📝 GraphiQL UI available at: http://localhost:3069/graphql');
};

