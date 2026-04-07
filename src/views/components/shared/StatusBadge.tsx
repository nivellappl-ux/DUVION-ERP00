interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "danger" | "neutral" | "info" | "primary";
}

const variantMap: Record<string, { bg: string; text: string }> = {
  success:  { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  warning:  { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  danger:   { bg: "rgba(239,68,68,0.15)",  text: "#EF4444" },
  neutral:  { bg: "rgba(107,114,128,0.15)", text: "#6B7280" },
  info:     { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
  primary:  { bg: "rgba(37,99,235,0.15)", text: "#2563EB" },
};

const autoVariant: Record<string, "success" | "warning" | "danger" | "neutral" | "info" | "primary"> = {
  // Faturas
  "Paga": "success",
  "Pago": "success",
  "Pendente": "warning",
  "Vencida": "danger",
  "Rascunho": "neutral",
  "Anulada": "neutral",
  // INSS
  "Regular": "success",
  "Irregular": "danger",
  "Isento": "info",
  // Urgência
  "Urgente": "danger",
  "Normal": "warning",
  "Baixa": "neutral",
  // Movimentos
  "Entrada": "success",
  "Saída": "danger",
  // Fiscal
  "Entregue": "success",
  "Atrasado": "danger",
  "Em curso": "info",
  // RH
  "Ativo": "success",
  "Inativo": "neutral",
  "Licença": "warning",
  // Generic
  "Aprovado": "success",
  "Rejeitado": "danger",
  "Concluído": "success",
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolved = variant || autoVariant[status] || "neutral";
  const colors = variantMap[resolved];

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: "12px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}
