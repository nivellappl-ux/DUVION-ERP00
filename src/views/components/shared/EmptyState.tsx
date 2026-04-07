import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className="p-5 rounded-full mb-4"
        style={{ backgroundColor: "var(--icon-bg)" }}
      >
        <Icon size={32} style={{ color: "var(--primary)" }} />
      </div>
      <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "16px", marginBottom: "6px" }}>{title}</p>
      {description && (
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "300px" }}>{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-5 py-2 rounded-md transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 500, fontSize: "14px" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
