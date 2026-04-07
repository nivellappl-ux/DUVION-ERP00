import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  accent?: boolean;
  loading?: boolean;
}

export function KPICard({ title, value, subtitle, change, trend, icon: Icon, accent = false, loading = false }: KPICardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "#10B981" : trend === "down" ? "#EF4444" : "var(--text-secondary)";

  if (loading) {
    return (
      <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-md animate-pulse" style={{ backgroundColor: "var(--icon-bg)", width: 48, height: 48 }} />
          <div className="h-5 w-16 rounded animate-pulse" style={{ backgroundColor: "var(--icon-bg)" }} />
        </div>
        <div className="h-4 w-24 rounded animate-pulse mb-2" style={{ backgroundColor: "var(--icon-bg)" }} />
        <div className="h-8 w-32 rounded animate-pulse" style={{ backgroundColor: "var(--icon-bg)" }} />
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg transition-colors"
      style={{
        backgroundColor: "var(--surface)",
        border: accent ? "1px solid rgba(37,99,235,0.4)" : "1px solid var(--border)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-md" style={{ backgroundColor: "var(--icon-bg)" }}>
          <Icon size={22} style={{ color: "var(--primary)" }} />
        </div>
        {change && (
          <div className="flex items-center gap-1">
            <TrendIcon size={14} style={{ color: trendColor }} />
            <span style={{ color: trendColor, fontSize: "12px", fontWeight: 600 }}>{change}</span>
          </div>
        )}
      </div>
      <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>{title}</p>
      <p style={{ color: accent ? "var(--primary)" : "var(--text-primary)", fontWeight: 700, fontSize: "24px", lineHeight: 1.2 }}>
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
      )}
    </div>
  );
}
