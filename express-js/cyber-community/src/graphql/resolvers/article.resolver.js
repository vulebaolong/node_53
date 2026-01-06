/**
 * GraphQL Resolvers cho Article
 * 
 * Resolver là các hàm xử lý logic để lấy dữ liệu từ database
 * Mỗi field trong GraphQL schema có thể có một resolver riêng
 */

import { prisma } from '../../common/prisma/conntect.prisma.js';

/**
 * articleResolver - Object chứa tất cả các resolver functions cho Article
 */
export const articleResolver = {
    /**
     * getArticles - Resolver cho query articles (lấy danh sách)
     * 
     * @param {Object} args - Tham số từ client (page, pageSize)
     * @returns {Object} - Object chứa danh sách bài viết và thông tin phân trang
     */
    async getArticles() {
        try {
            // Query database - lấy tất cả bài viết
            const articles = await prisma.articles.findMany({
                where: {
                    isDeleted: false
                }
            });
            
            // Luôn trả về mảng (không được null)
            return articles || [];
        } catch (error) {
            console.error('Error in getArticles:', error);
            // Trả về mảng rỗng thay vì null
            return [];
        }
    },
    
    /**
     * getArticleById - Resolver cho query article (lấy một bài viết)
     * 
     * @param {Number} id - ID của bài viết cần lấy
     * @returns {Object|null} - Object bài viết hoặc null nếu không tìm thấy
     */
    async getArticleById(id) {
        // Query database - tìm bài viết theo ID
        const article = await prisma.articles.findUnique({
            where: {
                id: id,
                isDeleted: false
            }
        });
        
        return article;
    },
    
    /**
     * createArticle - Resolver cho mutation createArticle (tạo mới)
     * 
     * @param {Object} args - Tham số từ client (title, content, imageUrl)
     * @returns {Object} - Object bài viết vừa tạo
     */
    async createArticle(args) {
        // Query database - tạo bài viết mới
        const newArticle = await prisma.articles.create({
            data: {
                title: args.title,
                content: args.content,
                imageUrl: args.imageUrl || null,
                userId: 1,
                views: 0,
                isDeleted: false
            }
        });
        
        return newArticle;
    },
    
    /**
     * updateArticle - Resolver cho mutation updateArticle (cập nhật)
     * 
     * @param {Object} args - Tham số từ client (id, title?, content?, imageUrl?)
     * @returns {Object} - Object bài viết đã được cập nhật
     */
    async updateArticle(args) {
        const { id, ...updateData } = args;
        
        // Xóa các field undefined
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        
        // Query database - cập nhật bài viết
        const updatedArticle = await prisma.articles.update({
            where: {
                id: id,
                isDeleted: false
            },
            data: updateData
        });
        
        return updatedArticle;
    },
    
    /**
     * deleteArticle - Resolver cho mutation deleteArticle (xóa)
     * 
     * @param {Number} id - ID của bài viết cần xóa
     * @returns {Object} - Object bài viết đã được đánh dấu xóa
     */
    async deleteArticle(id) {
        // Query database - xóa bài viết (soft delete)
        await prisma.articles.update({
            where: {
                id: id
            },
            data: {
                isDeleted: true
            }
        });
    }
};

