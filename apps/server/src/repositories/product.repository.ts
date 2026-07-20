import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

export class ProductRepository {
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return prisma.product.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async findSortedIdsByPrice(params: {
    skip: number;
    take: number;
    filters: any;
    direction: 'asc' | 'desc';
  }) {
    const conditions = [Prisma.sql`p."isActive" = true`];

    if (params.filters.category) conditions.push(Prisma.sql`c.slug = ${params.filters.category}`);
    if (params.filters.brand) conditions.push(Prisma.sql`b.slug = ${params.filters.brand}`);
    if (params.filters.search) conditions.push(Prisma.sql`p.name ILIKE ${'%' + params.filters.search + '%'}`);
    if (params.filters.inStock === 'true') conditions.push(Prisma.sql`p.stock > 0`);
    if (params.filters.material) conditions.push(Prisma.sql`p.material = ${params.filters.material}`);
    if (params.filters.finish) conditions.push(Prisma.sql`p.finish = ${params.filters.finish}`);
    if (params.filters.color) conditions.push(Prisma.sql`p.color = ${params.filters.color}`);
    if (params.filters.size) conditions.push(Prisma.sql`p.size = ${params.filters.size}`);
    
    if (params.filters.minPrice) {
      conditions.push(Prisma.sql`COALESCE(p."salePrice", p.price) >= ${Number(params.filters.minPrice)}`);
    }
    if (params.filters.maxPrice) {
      conditions.push(Prisma.sql`COALESCE(p."salePrice", p.price) <= ${Number(params.filters.maxPrice)}`);
    }

    const where = Prisma.join(conditions, ' AND ');

    const query = params.direction === 'asc'
      ? Prisma.sql`
          SELECT p.id 
          FROM products p
          LEFT JOIN categories c ON p."categoryId" = c.id
          LEFT JOIN brands b ON p."brandId" = b.id
          WHERE ${where}
          ORDER BY COALESCE(p."salePrice", p.price) ASC, p."createdAt" DESC
          LIMIT ${params.take} OFFSET ${params.skip}
        `
      : Prisma.sql`
          SELECT p.id 
          FROM products p
          LEFT JOIN categories c ON p."categoryId" = c.id
          LEFT JOIN brands b ON p."brandId" = b.id
          WHERE ${where}
          ORDER BY COALESCE(p."salePrice", p.price) DESC, p."createdAt" DESC
          LIMIT ${params.take} OFFSET ${params.skip}
        `;

    const result = await prisma.$queryRaw<{ id: string }[]>(query);
    return result.map(r => r.id);
  }

  async countRaw(filters: any) {
    const conditions = [Prisma.sql`p."isActive" = true`];

    if (filters.category) conditions.push(Prisma.sql`c.slug = ${filters.category}`);
    if (filters.brand) conditions.push(Prisma.sql`b.slug = ${filters.brand}`);
    if (filters.search) conditions.push(Prisma.sql`p.name ILIKE ${'%' + filters.search + '%'}`);
    if (filters.inStock === 'true') conditions.push(Prisma.sql`p.stock > 0`);
    if (filters.material) conditions.push(Prisma.sql`p.material = ${filters.material}`);
    if (filters.finish) conditions.push(Prisma.sql`p.finish = ${filters.finish}`);
    if (filters.color) conditions.push(Prisma.sql`p.color = ${filters.color}`);
    if (filters.size) conditions.push(Prisma.sql`p.size = ${filters.size}`);
    
    if (filters.minPrice) {
      conditions.push(Prisma.sql`COALESCE(p."salePrice", p.price) >= ${Number(filters.minPrice)}`);
    }
    if (filters.maxPrice) {
      conditions.push(Prisma.sql`COALESCE(p."salePrice", p.price) <= ${Number(filters.maxPrice)}`);
    }

    const where = Prisma.join(conditions, ' AND ');
    
    const query = Prisma.sql`
      SELECT COUNT(p.id)::int as count
      FROM products p
      LEFT JOIN categories c ON p."categoryId" = c.id
      LEFT JOIN brands b ON p."brandId" = b.id
      WHERE ${where}
    `;
    
    const result = await prisma.$queryRaw<{ count: number }[]>(query);
    return result[0]?.count || 0;
  }

  async count(where?: Prisma.ProductWhereInput) {
    return prisma.product.count({ where });
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
