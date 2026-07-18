import { productRepository } from "@/repositories/product.repository";
import { prisma } from "@/lib/prisma";

/**
 * Dashboard statistics service.
 * Aggregates data for the admin dashboard.
 */
export const dashboardService = {
    async getStats() {
        // Six months ago date
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const [
            totalProducts,
            activeProducts,
            archivedProducts,
            totalCategories,
            totalBrands,
            lowStockProducts,
            recentProducts,
            activeProductsData,
            outOfStockCount,
            lowestStockProductArr,
            topCategoriesData,
            recentCreations
        ] = await Promise.all([
            productRepository.count(),
            productRepository.count({ isActive: true }),
            productRepository.count({ isActive: false }),
            prisma.category.count(),
            prisma.brand.count(),
            productRepository.count({ stock: { lte: 5 }, isActive: true }),
            prisma.product.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    stock: true,
                    price: true,
                    isActive: true,
                    createdAt: true,
                    imageUrl: true,
                    images: { take: 1, select: { url: true } },
                    category: { select: { name: true } },
                    brand: { select: { name: true } },
                },
            }),
            prisma.product.findMany({
                where: { isActive: true },
                select: { stock: true, costPrice: true, price: true }
            }),
            productRepository.count({ stock: 0, isActive: true }),
            prisma.product.findMany({
                where: { isActive: true },
                orderBy: { stock: 'asc' },
                take: 1,
                select: { name: true, stock: true }
            }),
            prisma.category.findMany({
                include: {
                    _count: {
                        select: { products: { where: { isActive: true } } }
                    }
                }
            }),
            prisma.product.findMany({
                where: { createdAt: { gte: sixMonthsAgo } },
                select: { createdAt: true }
            })
        ]);

        // Calculate inventory value and potential revenue
        let inventoryValue = 0;
        let potentialRevenue = 0;
        activeProductsData.forEach(p => {
            inventoryValue += p.stock * p.costPrice;
            potentialRevenue += p.stock * p.price;
        });

        // Lowest stock product
        const lowestStockProduct = lowestStockProductArr.length > 0 ? lowestStockProductArr[0] : null;

        // Top 5 Categories
        const topCategories = topCategoriesData
            .map(c => ({ name: c.name, count: c._count.products }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Products added per month
        const monthlyProductsMap = new Map<string, number>();
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthStr = d.toLocaleString('default', { month: 'short' });
            monthlyProductsMap.set(monthStr, 0);
        }

        recentCreations.forEach(p => {
            const monthStr = p.createdAt.toLocaleString('default', { month: 'short' });
            if (monthlyProductsMap.has(monthStr)) {
                monthlyProductsMap.set(monthStr, monthlyProductsMap.get(monthStr)! + 1);
            }
        });

        const monthlyProducts = Array.from(monthlyProductsMap.entries()).map(([month, count]) => ({ month, count }));

        return {
            totalProducts,
            activeProducts,
            archivedProducts,
            totalCategories,
            totalBrands,
            lowStockProducts,
            recentProducts,
            inventoryValue,
            potentialRevenue,
            outOfStockCount,
            lowestStockProduct,
            topCategories,
            monthlyProducts
        };
    },
};
