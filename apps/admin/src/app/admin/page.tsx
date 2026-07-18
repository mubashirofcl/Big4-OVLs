import type { Metadata } from "next";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard.service";
import { Suspense } from "react";
import { QuickActionLink } from "@/components/admin/QuickActionLink";

export const metadata: Metadata = {
    title: "Dashboard — Big4 Admin",
    description: "Big4 Tiles & Sanitary admin dashboard",
};

export default async function DashboardPage() {
    return (
        <div style={{ paddingBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, letterSpacing: -0.5 }}>
                Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
                Overview of your store's performance.
            </p>

            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardContent />
            </Suspense>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div>
            <div className="dashboard-cards">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="saas-card skeleton" style={{ height: 140, padding: 24 }} />
                ))}
            </div>
            <div className="dashboard-bottom">
                <div className="saas-card skeleton" style={{ height: 400 }} />
                <div className="saas-card skeleton" style={{ height: 400 }} />
            </div>
        </div>
    );
}

async function DashboardContent() {
    const stats = await dashboardService.getStats();

    const lowStockDesc = stats.lowestStockProduct 
        ? `${stats.lowestStockProduct.name} is at ${stats.lowestStockProduct.stock}` 
        : "All active products have healthy stock";

    return (
        <div className="dashboard-layout">
            {stats.outOfStockCount > 0 && (
                <div
                    className="order-mobile-3"
                    style={{
                        background: "var(--danger-soft)",
                        border: "1px solid rgba(255,59,48,0.2)",
                        borderRadius: "var(--radius-md)",
                        padding: "12px 16px",
                        marginBottom: 24,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        color: "var(--danger)"
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
                        {stats.outOfStockCount} active {stats.outOfStockCount === 1 ? 'product is' : 'products are'} completely out of stock.
                    </div>
                    <Link
                        href="/admin/products?sort=stock-asc"
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--danger)",
                            textDecoration: "underline",
                            textUnderlineOffset: 2
                        }}
                    >
                        View items
                    </Link>
                </div>
            )}

            {/* Stat Cards Carousel */}
            <div className="dashboard-cards order-mobile-1">
                {/* Hero Card */}
                <Link
                    href="/admin/products"
                    className="saas-card"
                    style={{
                        background: "var(--hero-bg)",
                        color: "var(--hero-text)",
                        textDecoration: "none",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    <div style={{ fontSize: 13, color: "var(--hero-text)", opacity: 0.8, fontWeight: 500 }}>Total Products</div>
                    <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{stats.totalProducts}</div>
                    <div style={{ fontSize: 13, marginTop: 16, color: "var(--hero-text)", opacity: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "var(--success)" }}>↗ {stats.activeProducts} active</span>
                        <span>/</span>
                        <span>{stats.archivedProducts} archived</span>
                    </div>
                </Link>


                <Link
                    href="/admin/products?sort=stock-asc"
                    className="saas-card"
                    style={{ textDecoration: "none", color: "inherit", display: "block", border: stats.lowStockProducts > 0 ? "1px solid var(--warning)" : undefined }}
                >
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Low Stock (≤5)</div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8, color: stats.lowStockProducts > 0 ? "var(--warning)" : "inherit" }}>
                        {stats.lowStockProducts}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 16, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {lowStockDesc}
                    </div>
                </Link>

                <StatCard
                    title="Categories & Brands"
                    value={stats.totalCategories}
                    trend={`${stats.totalBrands} total brands configured`}
                    link="/admin/categories"
                />
            </div>

            <div className="dashboard-bottom">
                <div className="dashboard-col">
                    {/* Monthly Chart */}
                    <div className="saas-card order-mobile-4">
                        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Products Added (Last 6 Months)</h2>
                        <div style={{ height: 180, display: "flex", alignItems: "flex-end", gap: 12, paddingBottom: 20 }}>
                            {stats.monthlyProducts.map((item, i) => {
                                const maxCount = Math.max(...stats.monthlyProducts.map(m => m.count), 1);
                                const heightPercent = Math.max((item.count / maxCount) * 100, 4);
                                const isCurrent = i === stats.monthlyProducts.length - 1;
                                return (
                                    <div key={item.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>{item.count}</div>
                                        <div
                                            style={{
                                                width: "100%",
                                                maxWidth: 40,
                                                height: `${heightPercent}%`,
                                                background: isCurrent ? "var(--hero-bg)" : "var(--skeleton-base)",
                                                borderTopLeftRadius: "var(--radius-sm)",
                                                borderTopRightRadius: "var(--radius-sm)",
                                                transition: "height 500ms ease"
                                            }}
                                        />
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{item.month}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="saas-card order-mobile-6">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Recent Products</h2>
                            <Link href="/admin/products" style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", textDecoration: "none" }}>View All</Link>
                        </div>
                        {stats.recentProducts.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)", fontSize: 14 }}>
                                No products found.
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {stats.recentProducts.map((product, i) => {
                                    const imgUrl = product.images?.[0]?.url || product.imageUrl || null;
                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/admin/products/${product.id}`}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "16px 0",
                                                borderTop: i > 0 ? "1px solid var(--border-default)" : "none",
                                                textDecoration: "none",
                                                color: "inherit"
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                {imgUrl ? (
                                                    <img src={imgUrl} alt={product.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                                ) : (
                                                    <div style={{ width: 40, height: 40, background: 'var(--skeleton-base)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                                            <polyline points="21 15 16 10 5 21"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{product.name}</div>
                                                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                                                        {product.sku} · {product.category.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                                                    ₹{product.price.toLocaleString("en-IN")}
                                                </div>
                                                <div style={{ fontSize: 12, color: product.stock <= 5 ? "var(--warning)" : "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>
                                                    Stock: {product.stock}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="dashboard-col">
                    <div className="saas-card order-mobile-5">
                        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Top Categories</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {stats.topCategories.map((cat, i) => {
                                const maxCount = Math.max(...stats.topCategories.map(c => c.count), 1);
                                const widthPercent = (cat.count / maxCount) * 100;
                                return (
                                    <div key={cat.name}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                                            <span>{cat.name}</span>
                                            <span>{cat.count}</span>
                                        </div>
                                        <div style={{ width: "100%", height: 6, background: "var(--skeleton-base)", borderRadius: 3, overflow: "hidden" }}>
                                            <div style={{ width: `${widthPercent}%`, height: "100%", background: i === 0 ? "var(--hero-bg)" : "var(--text-muted)", borderRadius: 3 }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="saas-card order-mobile-7">
                        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <QuickActionLink 
                                href="/admin/products/new" 
                                label="Add New Product" 
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                } 
                            />
                            <QuickActionLink 
                                href="/admin/categories" 
                                label="Manage Categories" 
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    </svg>
                                } 
                            />
                            <QuickActionLink 
                                href="/admin/brands" 
                                label="Manage Brands" 
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                        <line x1="7" y1="7" x2="7.01" y2="7" />
                                    </svg>
                                } 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, trendPositive, link }: { title: string; value: string | number; trend: string; trendPositive?: boolean; link?: string }) {
    const content = (
        <>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{title}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{value}</div>
            <div style={{ fontSize: 12, marginTop: 16, color: trendPositive ? "var(--success)" : "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                {trendPositive && <span style={{ fontSize: 10 }}>↗</span>}
                {trend}
            </div>
        </>
    );

    if (link) {
        return <Link href={link} className="saas-card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>{content}</Link>;
    }
    return <div className="saas-card">{content}</div>;
}

