import { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  noPadding?: boolean;
  className?: string;
}

export function SectionCard({ title, subtitle, actions, children, noPadding = false, className = "" }: SectionCardProps) {
  return (
    <div
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {(title || subtitle || actions) && (
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h3 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "16px" }}>{title}</h3>
            {subtitle && (
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "2px" }}>{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-6"}>{children}</div>
    </div>
  );
}
