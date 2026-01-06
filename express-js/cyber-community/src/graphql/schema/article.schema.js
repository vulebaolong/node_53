/**
 * ============================================
 * GRAPHQL SCHEMA - ĐỊNH NGHĨA CẤU TRÚC DỮ LIỆU
 * ============================================
 * 
 * File này định nghĩa:
 * 1. Schema: Cấu trúc dữ liệu và operations (queries, mutations)
 * 2. Resolvers: Các hàm xử lý logic để lấy dữ liệu từ database
 */

// Import buildSchema từ thư viện graphql
// buildSchema: Hàm chuyển đổi string schema thành GraphQL Schema object
import { buildSchema } from 'graphql';

// Import articleService để xử lý logic và query database
// articleService: Object chứa các hàm (findAll, findOne, create, update, delete)
import { articleService } from '../../services/article.service.js';

// ============================================
// BƯỚC 1: ĐỊNH NGHĨA SCHEMA BẰNG STRING
// ============================================
// 
// Schema định nghĩa:
// - Cấu trúc dữ liệu (Article có những field gì?)
// - Các query (lấy dữ liệu - giống GET trong REST)
// - Các mutation (thay đổi dữ liệu - giống POST/PUT/DELETE trong REST)
//
// buildSchema(): Chuyển string schema thành GraphQL Schema object
export const schema = buildSchema(`
    # ============================================
    # TYPE: Article - Định nghĩa cấu trúc bài viết
    # ============================================
    # 
    # Giống như định nghĩa một object trong JavaScript:
    # {
    #   id: number,
    #   title: string,
    #   content: string,
    #   ...
    # }
    
    type Article {
        id: Int              # ID bài viết (Int = số nguyên, không có ! = có thể null)
        title: String        # Tiêu đề (String = chuỗi, có thể null)
        content: String      # Nội dung (có thể null)
        imageUrl: String     # URL hình ảnh (có thể null)
        views: Int           # Số lượt xem (có thể null)
        userId: Int          # ID người tạo (có thể null)
        createdAt: String   # Thời gian tạo (GraphQL không có Date type, dùng String)
        updatedAt: String   # Thời gian cập nhật (String)
    }

    # ============================================
    # TYPE: Query - Định nghĩa các query (đọc dữ liệu)
    # ============================================
    # 
    # Query = Lấy dữ liệu (giống GET trong REST API)
    # 
    # Ví dụ client gọi:
    # query {
    #   articles {
    #     id
    #     title
    #   }
    # }
    
    type Query {
        # Query 1: Lấy danh sách bài viết
        # [Article] = mảng Article (có thể null hoặc mảng rỗng)
        articles: [Article]
        
        # Query 2: Lấy một bài viết theo ID
        # id: Int! = tham số id bắt buộc (có !)
        # : Article = trả về một Article (có thể null nếu không tìm thấy)
        article(id: Int!): Article
    }

    # ============================================
    # TYPE: Mutation - Định nghĩa các mutation (thay đổi dữ liệu)
    # ============================================
    # 
    # Mutation = Thay đổi dữ liệu (giống POST/PUT/DELETE trong REST API)
    # 
    # Ví dụ client gọi:
    # mutation {
    #   createArticle(title: "...", content: "...") {
    #     id
    #     title
    #   }
    # }
    
    type Mutation {
        # Mutation 1: Tạo bài viết mới
        # title: String! = tham số title bắt buộc (có !)
        # content: String! = tham số content bắt buộc (có !)
        # : Article = trả về Article vừa tạo
        createArticle(title: String!, content: String!): Article
        
        # Mutation 2: Cập nhật bài viết
        # id: Int! = tham số id bắt buộc
        # title: String = tham số title không bắt buộc (không có !)
        # content: String = tham số content không bắt buộc
        # Có thể chỉ update một field (ví dụ: chỉ update title)
        updateArticle(id: Int!, title: String, content: String): Article
        
        # Mutation 3: Xóa bài viết (soft delete)
        # id: Int! = tham số id bắt buộc
        # : String = trả về message thông báo
        deleteArticle(id: Int!): String
    }
`);

// ============================================
// BƯỚC 2: ĐỊNH NGHĨA ROOT RESOLVERS
// ============================================
// 
// Resolvers = Các hàm xử lý logic để lấy dữ liệu từ database
// 
// Cấu trúc:
// {
//   articles: async () => { ... },      // Resolver cho query articles
//   article: async (arg) => { ... },    // Resolver cho query article
//   createArticle: async (arg) => { ... },  // Resolver cho mutation createArticle
//   ...
// }
//
// Lưu ý: Tên resolver phải KHỚP với tên query/mutation trong schema
export const root = {
    // ============================================
    // QUERY RESOLVERS - Xử lý các query (đọc dữ liệu)
    // ============================================
    
    /**
     * Resolver cho query "articles" - Lấy danh sách bài viết
     * 
     * @param {Object} arg - Tham số từ client (có thể có page, pageSize)
     * @returns {Array} - Mảng các Article
     */
    async articles(arg) {
        // arg: Tham số từ GraphQL query
        // Ví dụ: query { articles(page: 1, pageSize: 10) { ... } }
        // → arg = { page: 1, pageSize: 10 }
        // Nếu không có tham số: arg = {}
        
        // Tạo request object giống như Express request
        // Service đã có sẵn, cần format theo đúng cấu trúc mà service mong đợi
        const req = { 
            query: {
                // Lấy page từ arg, nếu không có thì dùng 1 (mặc định)
                page: arg.page || 1,
                // Lấy pageSize từ arg, nếu không có thì dùng 10 (mặc định)
                pageSize: arg.pageSize || 10
            }
        };
        
        // Gọi service để lấy dữ liệu từ database
        // articleService.findAll(req): Hàm trong service xử lý logic
        // Service sẽ:
        //   1. Parse query params (page, pageSize)
        //   2. Query database qua Prisma
        //   3. Trả về object: { page, pageSize, totalItem, totalPage, items: [...] }
        // await: Chờ kết quả từ database (vì là async operation)
        const result = await articleService.findAll(req);
        
        // Trả về danh sách bài viết
        // result.items: Mảng các bài viết từ database
        // || []: Nếu result.items là null/undefined thì trả về mảng rỗng
        // GraphQL sẽ tự động filter chỉ trả về các field client yêu cầu
        return result.items || [];
    },

    /**
     * Resolver cho query "article" - Lấy một bài viết theo ID
     * 
     * @param {Object} arg - Tham số từ client { id: 1 }
     * @returns {Object|null} - Article object hoặc null nếu không tìm thấy
     */
    async article(arg) {
        // arg: Tham số từ GraphQL query
        // Ví dụ: query { article(id: 1) { ... } }
        // → arg = { id: 1 }
        
        // Tạo request object
        // req.params: Chứa path parameters (giống Express)
        const req = { 
            params: { 
                id: arg.id  // Lấy id từ tham số GraphQL
            } 
        };
        
        // Gọi service để lấy dữ liệu từ database
        // articleService.findOne(req): Tìm bài viết theo ID
        // Trả về Article object hoặc null nếu không tìm thấy
        return await articleService.findOne(req);
    },

    // ============================================
    // MUTATION RESOLVERS - Xử lý các mutation (thay đổi dữ liệu)
    // ============================================
    
    /**
     * Resolver cho mutation "createArticle" - Tạo bài viết mới
     * 
     * @param {Object} arg - Tham số từ client { title: "...", content: "..." }
     * @returns {Object} - Article object vừa tạo
     */
    async createArticle(arg) {
        // arg: Tham số từ GraphQL mutation
        // Ví dụ: mutation { createArticle(title: "...", content: "...") { ... } }
        // → arg = { title: "...", content: "..." }
        
        // Tạo request object
        // req.body: Chứa body data (giống Express)
        const req = { 
            body: arg  // Toàn bộ tham số từ GraphQL mutation
        };
        
        // Gọi service để tạo bài viết trong database
        // articleService.create(req): Insert bài viết mới vào database
        // Trả về Article object vừa tạo
        return await articleService.create(req);
    },

    /**
     * Resolver cho mutation "updateArticle" - Cập nhật bài viết
     * 
     * @param {Object} arg - Tham số từ client { id: 1, title: "...", content: "..." }
     * @returns {Object} - Article object đã được cập nhật
     */
    async updateArticle(arg) {
        // arg: Tham số từ GraphQL mutation
        // Ví dụ: mutation { updateArticle(id: 1, title: "...") { ... } }
        // → arg = { id: 1, title: "..." }
        
        // Tạo request object
        const req = { 
            params: { 
                id: arg.id  // ID của bài viết cần update
            },
            body: arg  // Data cần update (title, content, ...)
        };
        
        // Gọi service để cập nhật bài viết trong database
        // articleService.update(req): Update bài viết trong database
        // Trả về Article object đã được cập nhật
        return await articleService.update(req);
    },

    /**
     * Resolver cho mutation "deleteArticle" - Xóa bài viết (soft delete)
     * 
     * @param {Object} arg - Tham số từ client { id: 1 }
     * @returns {String} - Message thông báo
     */
    async deleteArticle(arg) {
        // arg: Tham số từ GraphQL mutation
        // Ví dụ: mutation { deleteArticle(id: 1) }
        // → arg = { id: 1 }
        
        // Tạo request object
        const req = { 
            params: { 
                id: arg.id  // ID của bài viết cần xóa
            } 
        };
        
        // Gọi service để xóa bài viết (soft delete)
        // articleService.delete(req): Đánh dấu isDeleted = true
        // Không trả về gì (void)
        await articleService.delete(req);
        
        // Trả về message thông báo
        // Template string để tạo message với id
        // GraphQL sẽ trả về message này cho client
        return `Đã xóa bài viết có ID: ${arg.id}`;
    }
};
