import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ icon: Icon, title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-md" style={{ backgroundColor: "var(--icon-bg)" }}>
          <Icon size={22} style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "22px", lineHeight: 1.2 }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "2px" }}>{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
