export default function AdminLoading() {
  return (
    <div style={{ padding: "8px 0", animation: "fade-in 150ms ease" }}>
      {/* Header Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div
            style={{
              width: 180,
              height: 28,
              borderRadius: "var(--radius-md)",
              background: "var(--skeleton-base)",
              marginBottom: 8,
            }}
          />
          <div
            style={{
              width: 280,
              height: 16,
              borderRadius: "var(--radius-sm)",
              background: "var(--skeleton-base)",
            }}
          />
        </div>
        <div
          style={{
            width: 120,
            height: 40,
            borderRadius: "var(--radius-pill)",
            background: "var(--skeleton-base)",
          }}
        />
      </div>

      {/* Main Content Skeleton Cards */}
      <div className="saas-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ width: "100%", height: 48, borderRadius: "var(--radius-md)", background: "var(--skeleton-base)" }} />
        <div style={{ width: "100%", height: 64, borderRadius: "var(--radius-md)", background: "var(--skeleton-base)" }} />
        <div style={{ width: "100%", height: 64, borderRadius: "var(--radius-md)", background: "var(--skeleton-base)" }} />
        <div style={{ width: "100%", height: 64, borderRadius: "var(--radius-md)", background: "var(--skeleton-base)" }} />
      </div>
    </div>
  );
}
