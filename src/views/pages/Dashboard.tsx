import { useRouter } from "next/navigation";
import {
  DollarSign,
  FileText,
  Wallet,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  BookOpen,
  Shield,
  Building2,
  Layers,
  Activity,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const chartData = [
  { month: "Out", receitas: 42000000, despesas: 31000000, lucro: 11000000 },
  { month: "Nov", receitas: 48000000, despesas: 35000000, lucro: 13000000 },
  { month: "Dez", receitas: 55000000, despesas: 38000000, lucro: 17000000 },
  { month: "Jan", receitas: 45000000, despesas: 32000000, lucro: 13000000 },
  { month: "Fev", receitas: 52000000, despesas: 36000000, lucro: 16000000 },
  { month: "Mar", receitas: 67000000, despesas: 44000000, lucro: 23000000 },
];

const recentActivity = [
  { id: "FT 2025/245", type: "fatura", client: "Sonangol E.P.", amount: 12500000, date: "31/03/2025", status: "Paga" },
  { id: "FT 2025/244", type: "fatura", client: "Unitel S.A.", amount: 8750000, date: "30/03/2025", status: "Pendente" },
  { id: "DES-2025/0043", type: "despesa", client: "Salários Março 2025", amount: 11900000, date: "31/03/2025", status: "Pago" },
  { id: "FT 2025/243", type: "fatura", client: "BAI", amount: 15200000, date: "29/03/2025", status: "Paga" },
  { id: "FT 2025/242", type: "fatura", client: "Angola Telecom", amount: 6300000, date: "28/03/2025", status: "Vencida" },
];

const alerts = [
  { id: "a1", level: "danger", icon: AlertTriangle, title: "Faturas Vencidas", desc: "FT 2025/242 — Angola Telecom (6.3M AOA)", action: "Ver Faturação", path: "/dashboard/faturacao" },
  { id: "a2", level: "warning", icon: Clock, title: "INSS vence em 10/04", desc: "Contribuição Março — 1.904M AOA por liquidar", action: "Ver Fiscalidade", path: "/dashboard/fiscalidade" },
  { id: "a3", level: "warning", icon: Clock, title: "IVA vence em 15/04", desc: "Declaração Março — 6.58M AOA por entregar", action: "Ver Fiscalidade", path: "/dashboard/fiscalidade" },
  { id: "a4", level: "info", icon: AlertTriangle, title: "Plafond Crítico", desc: "Tecnologia (95%) e Operações (92%) quase esgotados", action: "Ver Plafond", path: "/dashboard/plafond" },
];

const modules = [
  { icon: TrendingUp, label: "Financeiro", path: "/dashboard/financeiro", desc: "Receitas & Despesas", color: "#2563EB" },
  { icon: BookOpen, label: "Diário de Caixa", path: "/dashboard/diario-caixa", desc: "Movimentos do dia", color: "#10B981" },
  { icon: FileText, label: "Faturação", path: "/dashboard/faturacao", desc: "Faturas AGT-compliant", color: "#3B82F6" },
  { icon: Users, label: "Recursos Humanos", path: "/dashboard/rh", desc: "Salários & INSS/IRT", color: "#8B5CF6" },
  { icon: Shield, label: "Fiscalidade", path: "/dashboard/fiscalidade", desc: "IVA · INSS · IRT", color: "#EF4444" },
  { icon: Building2, label: "Conta Bancária", path: "/dashboard/conta-bancaria", desc: "BAI · BFA · BIC", color: "#F59E0B" },
  { icon: Layers, label: "Plafond", path: "/dashboard/plafond", desc: "Orçamento departamentos", color: "#EC4899" },
  { icon: Wallet, label: "Tesouraria", path: "/dashboard/tesouraria", desc: "Fluxo de caixa", color: "#06B6D4" },
];

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 0 }).format(v);

const statusColors: Record<string, { bg: string; text: string }> = {
  Paga:    { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  Pago:    { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  Pendente:{ bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  Vencida: { bg: "rgba(239,68,68,0.15)",  text: "#EF4444" },
};

const alertLevelStyle = {
  danger:  { border: "#EF444440", bg: "#EF444408", icon: "#EF4444", badge: "#EF444420" },
  warning: { border: "#F59E0B40", bg: "#F59E0B08", icon: "#F59E0B", badge: "#F59E0B20" },
  info:    { border: "#2563EB40", bg: "#2563EB08", icon: "#2563EB", badge: "#2563EB20" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();

  const totalReceitas = 67000000;
  const totalDespesas = 44000000;
  const lucro = totalReceitas - totalDespesas;
  const margem = ((lucro / totalReceitas) * 100).toFixed(1);
  const saldoCaixa = 39130000;
  const totalFuncionarios = 127;
  const faturasPendentes = 12;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "22px" }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "2px" }}>
            Visão geral — Março 2025 · Actualizado às 16:30
          </p>
        </div>
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Activity size={13} style={{ color: "#10B981" }} />
          <span style={{ color: "#10B981", fontSize: "11px", fontWeight: 600 }}>
            Sistema Operacional
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita */}
        <div
          className="p-5 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          onClick={() => router.push("/dashboard/financeiro")}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-md" style={{ backgroundColor: "var(--icon-bg)" }}>
              <ArrowUpRight size={18} style={{ color: "var(--primary)" }} />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={13} style={{ color: "#10B981" }} />
              <span style={{ color: "#10B981", fontSize: "11px", fontWeight: 600 }}>+12.5%</span>
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Receitas (Mar)</p>
          <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "22px", lineHeight: 1.2 }}>
            {(totalReceitas / 1000000).toFixed(1)}M
            <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 400 }}> AOA</span>
          </p>
        </div>

        {/* Despesas */}
        <div
          className="p-5 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          onClick={() => router.push("/dashboard/financeiro")}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-md" style={{ backgroundColor: "var(--icon-bg)" }}>
              <ArrowDownRight size={18} style={{ color: "#EF4444" }} />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={13} style={{ color: "#EF4444" }} />
              <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 600 }}>+4.1%</span>
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Despesas (Mar)</p>
          <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "22px", lineHeight: 1.2 }}>
            {(totalDespesas / 1000000).toFixed(1)}M
            <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 400 }}> AOA</span>
          </p>
        </div>

        {/* Lucro */}
        <div
          className="p-5 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: "var(--surface)", border: "1px solid rgba(37,99,235,0.35)" }}
          onClick={() => router.push("/dashboard/financeiro")}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-md" style={{ backgroundColor: "var(--icon-bg)" }}>
              <DollarSign size={18} style={{ color: "var(--primary)" }} />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={13} style={{ color: "#10B981" }} />
              <span style={{ color: "#10B981", fontSize: "11px", fontWeight: 600 }}>+22.3%</span>
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Resultado Líquido</p>
          <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "22px", lineHeight: 1.2 }}>
            {(lucro / 1000000).toFixed(1)}M
            <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 400 }}> AOA</span>
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "11px", marginTop: "2px" }}>
            Margem {margem}%
          </p>
        </div>

        {/* Saldo Caixa */}
        <div
          className="p-5 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          onClick={() => router.push("/dashboard/diario-caixa")}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-md" style={{ backgroundColor: "var(--icon-bg)" }}>
              <Wallet size={18} style={{ color: "var(--primary)" }} />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={13} style={{ color: "#10B981" }} />
              <span style={{ color: "#10B981", fontSize: "11px", fontWeight: 600 }}>+5.1%</span>
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Saldo em Caixa</p>
          <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "22px", lineHeight: 1.2 }}>
            {(saldoCaixa / 1000000).toFixed(1)}M
            <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 400 }}> AOA</span>
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "11px", marginTop: "2px" }}>
            ≈ {fmt(Math.round(saldoCaixa / 850))} USD
          </p>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Faturas Emitidas", value: "245", sub: "Março 2025", icon: FileText, path: "/dashboard/faturacao", color: "#2563EB" },
          { label: "Faturas Pendentes", value: String(faturasPendentes), sub: "por cobrar", icon: Clock, path: "/dashboard/faturacao", color: "#F59E0B" },
          { label: "Funcionários", value: String(totalFuncionarios), sub: "ativos", icon: Users, path: "/dashboard/rh", color: "#8B5CF6" },
          { label: "Obrigações Fiscais", value: "3", sub: "por liquidar", icon: Shield, path: "/dashboard/fiscalidade", color: "#EF4444" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="p-4 rounded-lg flex items-center gap-3 cursor-pointer transition-colors"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              onClick={() => router.push(item.path)}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface)"; }}
            >
              <div
                className="p-2.5 rounded-md flex-shrink-0"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon size={16} style={{ color: item.color }} />
              </div>
              <div>
                <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "18px" }}>{item.value}</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "11px" }}>{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div
          className="lg:col-span-2 p-5 rounded-lg"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "15px" }}>
                Receitas vs Despesas vs Resultado
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Últimos 6 meses — valores em AOA</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/financeiro")}
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              Ver detalhe <ChevronRight size={12} />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="var(--text-secondary)"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = { receitas: "Receitas", despesas: "Despesas", lucro: "Resultado" };
                    return [`${(value / 1000000).toFixed(1)}M AOA`, labels[name] || name];
                  }}
                />
                <Legend
                  formatter={(v) => {
                    const l: Record<string, string> = { receitas: "Receitas", despesas: "Despesas", lucro: "Resultado" };
                    return <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{l[v] || v}</span>;
                  }}
                />
                <Bar dataKey="receitas" fill="#2563EB" radius={[3, 3, 0, 0]} name="receitas" />
                <Bar dataKey="despesas" fill="#EF4444" opacity={0.6} radius={[3, 3, 0, 0]} name="despesas" />
                <Line
                  type="monotone"
                  dataKey="lucro"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", r: 3 }}
                  name="lucro"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div
          className="p-5 rounded-lg"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "15px" }}>
              Alertas Activos
            </p>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#EF4444", fontSize: "11px", fontWeight: 700 }}
            >
              {alerts.length}
            </span>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              const s = alertLevelStyle[alert.level as keyof typeof alertLevelStyle];
              return (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg cursor-pointer"
                  style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
                  onClick={() => router.push(alert.path)}
                >
                  <div className="flex items-start gap-2">
                    <Icon size={13} style={{ color: s.icon, marginTop: "2px", flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p style={{ color: "var(--text-primary)", fontSize: "12px", fontWeight: 600 }}>{alert.title}</p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "11px", marginTop: "1px", lineHeight: 1.4 }}>{alert.desc}</p>
                      <button
                        className="mt-1.5"
                        style={{ color: s.icon, fontSize: "11px", fontWeight: 600 }}
                      >
                        {alert.action} →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity + Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div
            className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "15px" }}>
              Actividade Recente
            </p>
            <button
              onClick={() => router.push("/dashboard/financeiro")}
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              Ver tudo <ChevronRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid var(--border)` }}>
                  {["Referência", "Descrição", "Valor", "Data", "Estado"].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-left ${h === "Valor" ? "text-right" : ""} ${h === "Estado" ? "text-center" : ""}`}
                      style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((tx, i) => {
                  const colors = statusColors[tx.status] || { bg: "rgba(107,114,128,0.15)", text: "#6B7280" };
                  return (
                    <tr
                      key={tx.id}
                      className="transition-colors cursor-pointer"
                      style={{ backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--surface-2)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = i % 2 === 0 ? "var(--surface)" : "var(--surface-2)"; }}
                    >
                      <td className="px-4 py-2.5" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>
                        {tx.id}
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "var(--text-primary)", fontSize: "12px" }}>
                        {tx.client}
                      </td>
                      <td className="px-4 py-2.5 text-right" style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "12px" }}>
                        <span style={{ color: tx.type === "despesa" ? "#EF4444" : "var(--text-primary)" }}>
                          {tx.type === "despesa" ? "-" : "+"}{(tx.amount / 1000000).toFixed(1)}M AOA
                        </span>
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                        {tx.date}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs"
                          style={{ backgroundColor: colors.bg, color: colors.text, fontWeight: 600 }}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Module Quick Access */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "15px" }}>
              Acesso Rápido
            </p>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.path}
                  onClick={() => router.push(mod.path)}
                  className="flex flex-col items-start p-3 rounded-lg transition-colors text-left"
                  style={{ backgroundColor: "var(--surface-2)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-2)"; }}
                >
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${mod.color}20` }}
                  >
                    <Icon size={15} style={{ color: mod.color }} />
                  </div>
                  <p style={{ color: "var(--text-primary)", fontSize: "11px", fontWeight: 600 }}>{mod.label}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "10px", marginTop: "1px" }}>{mod.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div
        className="p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {[
          { label: "IVA Pendente (Março)", value: "6.58M AOA", color: "#2563EB", path: "/dashboard/fiscalidade" },
          { label: "Folha Salarial (Março)", value: "11.9M AOA", color: "#8B5CF6", path: "/dashboard/rh" },
          { label: "Saldo BAI + BFA + BIC", value: "107.2M AOA", color: "#10B981", path: "/dashboard/conta-bancaria" },
          { label: "Taxa BNA (USD/AOA)", value: "1 USD = 850 AOA", color: "#06B6D4", path: "/dashboard/tesouraria" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="cursor-pointer"
            onClick={() => router.push(stat.path)}
          >
            <p style={{ color: "var(--text-secondary)", fontSize: "11px" }}>{stat.label}</p>
            <p style={{ color: stat.color, fontWeight: 700, fontSize: "14px", marginTop: "2px" }}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
