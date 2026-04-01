import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, AlertCircle, RefreshCw, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PageHeader } from "../components/shared/PageHeader";
import { SectionCard } from "../components/shared/SectionCard";
import { KPICard } from "../components/shared/KPICard";
import { StatusBadge } from "../components/shared/StatusBadge";

const cashFlowData = [
  { month: "Out", entradas: 45000000, saidas: 32000000 },
  { month: "Nov", entradas: 52000000, saidas: 38000000 },
  { month: "Dez", entradas: 55000000, saidas: 38000000 },
  { month: "Jan", entradas: 45000000, saidas: 32000000 },
  { month: "Fev", entradas: 52000000, saidas: 36000000 },
  { month: "Mar", entradas: 67000000, saidas: 44000000 },
];

const bankAccounts = [
  { banco: "BAI", numero: "AO06 0040 0000 1234 5678 90", saldo: 45800000, moeda: "AOA" as const, cor: "var(--primary)" },
  { banco: "BFA", numero: "AO06 1234 5678 9012 3456 78", saldo: 32500000, moeda: "AOA" as const, cor: "#3B82F6" },
  { banco: "BIC", numero: "AO06 0001 0002 0003 0004 00", saldo: 28900000, moeda: "AOA" as const, cor: "#10B981" },
  { banco: "BAI", numero: "AO06 0040 0000 5432 1876 09", saldo: 125000, moeda: "USD" as const, cor: "var(--primary)" },
];

const pendingPayments = [
  { id: "PP-001", descricao: "Fornecedor — Electro Services", valor: 8500000, moeda: "AOA", vencimento: "02/04/2025", urgencia: "Urgente" },
  { id: "PP-002", descricao: "Salários — Março 2025", valor: 12500000, moeda: "AOA", vencimento: "05/04/2025", urgencia: "Urgente" },
  { id: "PP-003", descricao: "INSS — Contribuição Março", valor: 1904000, moeda: "AOA", vencimento: "10/04/2025", urgencia: "Normal" },
  { id: "PP-004", descricao: "IVA — Declaração Março", valor: 6580000, moeda: "AOA", vencimento: "15/04/2025", urgencia: "Normal" },
  { id: "PP-005", descricao: "Aluguel — Escritório Abril", valor: 2500000, moeda: "AOA", vencimento: "15/04/2025", urgencia: "Baixa" },
];

const fmt = (v: number, dec = 0) =>
  new Intl.NumberFormat("pt-AO", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v);

const BNA_RATE = 850;
const MARKET_RATE = 865;

export default function Tesouraria() {
  const [lastUpdate] = useState("31/03/2025 às 16:30");

  const totalAOA = bankAccounts.filter((a) => a.moeda === "AOA").reduce((s, a) => s + a.saldo, 0);
  const totalUSD = bankAccounts.filter((a) => a.moeda === "USD").reduce((s, a) => s + a.saldo, 0);
  const totalEquiv = totalAOA + totalUSD * BNA_RATE;
  const totalPendente = pendingPayments.reduce((s, p) => s + p.valor, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        icon={Wallet}
        title="Tesouraria"
        subtitle="Gestão de fluxo de caixa e taxa de câmbio"
        actions={
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 p-2 rounded-md text-xs transition-colors"
              style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}
              title={`Actualizado: ${lastUpdate}`}
            >
              <RefreshCw size={14} />
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs transition-colors"
              style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}
            >
              <Download size={13} /> Exportar
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Saldo Total (equiv.)" value={`${(totalEquiv / 1000000).toFixed(1)}M AOA`} icon={Wallet} change="+5.1%" trend="up" accent />
        <KPICard title="Saldo AOA" value={`${(totalAOA / 1000000).toFixed(1)}M AOA`} icon={ArrowUpRight} change="3 contas" trend="up" />
        <KPICard title="Saldo USD" value={`$${fmt(totalUSD)}`} icon={TrendingUp} subtitle={`≈ ${fmt(totalUSD * BNA_RATE)} AOA`} />
        <KPICard title="Pagamentos Pendentes" value={`${(totalPendente / 1000000).toFixed(1)}M AOA`} icon={AlertCircle} change={`${pendingPayments.length} itens`} trend="down" />
      </div>

      {/* Exchange Rate Widget */}
      <div
        className="p-5 rounded-lg"
        style={{ backgroundColor: "#1A1A1A" }}
      >
        <div className="flex items-center justify-between mb-4">
          <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "15px" }}>
            Taxa de Câmbio USD/AOA
          </p>
          <span style={{ color: "#9A9A9A", fontSize: "11px" }}>Actualizado: {lastUpdate}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: "#0F0F0F" }}>
            <div>
              <p style={{ color: "#9A9A9A", fontSize: "11px", marginBottom: "4px" }}>Taxa Oficial BNA</p>
              <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "28px" }}>{BNA_RATE}</p>
              <p style={{ color: "#9A9A9A", fontSize: "11px" }}>AOA / USD</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <TrendingUp size={20} style={{ color: "#10B981" }} />
              <span style={{ color: "#10B981", fontSize: "11px", fontWeight: 600 }}>+0.2%</span>
            </div>
          </div>
          <div className="p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: "#0F0F0F" }}>
            <div>
              <p style={{ color: "#9A9A9A", fontSize: "11px", marginBottom: "4px" }}>Taxa Mercado</p>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "28px" }}>{MARKET_RATE}</p>
              <p style={{ color: "#9A9A9A", fontSize: "11px" }}>AOA / USD</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <TrendingDown size={20} style={{ color: "#EF4444" }} />
              <span style={{ color: "#EF4444", fontSize: "11px", fontWeight: 600 }}>-0.1%</span>
            </div>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: "#0F0F0F" }}>
            <p style={{ color: "#9A9A9A", fontSize: "11px", marginBottom: "8px" }}>Simulador de Conversão</p>
            <div className="flex items-center gap-2">
              <span style={{ color: "#F5F5F5", fontSize: "13px" }}>$</span>
              <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "16px" }}>1,000</span>
              <ArrowDownRight size={14} style={{ color: "#9A9A9A" }} />
              <span style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "16px" }}>{fmt(1000 * BNA_RATE)}</span>
            </div>
            <p style={{ color: "#9A9A9A", fontSize: "11px", marginTop: "4px" }}>Usando taxa BNA</p>
          </div>
        </div>
      </div>

      {/* Charts + Bank Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 p-5 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
          <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>
            Fluxo de Caixa — Últimos 6 Meses
          </p>
          <p style={{ color: "#9A9A9A", fontSize: "12px", marginBottom: "16px" }}>Entradas vs Saídas em AOA</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2422" vertical={false} />
                <XAxis dataKey="month" stroke="#9A9A9A" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="#9A9A9A"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2422", borderRadius: "8px", color: "#F5F5F5", fontSize: "12px" }}
                  formatter={(value: number, name: string) => [
                    `${(value / 1000000).toFixed(1)}M AOA`,
                    name === "entradas" ? "Entradas" : "Saídas",
                  ]}
                />
                <Legend
                  formatter={(v) => (
                    <span style={{ fontSize: "11px", color: "#9A9A9A" }}>
                      {v === "entradas" ? "Entradas" : "Saídas"}
                    </span>
                  )}
                />
                <Bar dataKey="entradas" fill="#2563EB" radius={[3, 3, 0, 0]} name="entradas" />
                <Bar dataKey="saidas" fill="#2A2422" radius={[3, 3, 0, 0]} name="saidas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="p-5 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
          <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "15px", marginBottom: "16px" }}>
            Contas Bancárias
          </p>
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div
                key={`${account.banco}-${account.moeda}`}
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#0F0F0F", border: "1px solid #2A2422" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="px-2.5 py-1 rounded text-xs"
                    style={{ backgroundColor: `${account.cor}20`, color: account.cor, fontWeight: 700 }}
                  >
                    {account.banco}
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: "#2A2422", color: "#9A9A9A", fontWeight: 500 }}
                  >
                    {account.moeda}
                  </span>
                </div>
                <p style={{ color: "#9A9A9A", fontSize: "10px", fontFamily: "monospace", marginBottom: "4px" }}>
                  {account.numero}
                </p>
                <p style={{ color: account.cor, fontWeight: 700, fontSize: "16px" }}>
                  {account.moeda === "USD" ? "$" : ""}{fmt(account.saldo)}
                  <span style={{ color: "#9A9A9A", fontWeight: 400, fontSize: "11px" }}> {account.moeda}</span>
                </p>
                {account.moeda === "USD" && (
                  <p style={{ color: "#9A9A9A", fontSize: "11px" }}>
                    ≈ {fmt(account.saldo * BNA_RATE)} AOA
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Payments */}
      <SectionCard
        title="Pagamentos a Efectuar"
        subtitle={`${pendingPayments.length} itens — Total: ${fmt(totalPendente)} AOA`}
        noPadding
        actions={
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs"
            style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}
          >
            <Download size={13} /> Exportar
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                {["Ref.", "Descrição", "Moeda", "Valor (AOA)", "Vencimento", "Urgência"].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((p, i) => (
                <tr
                  key={p.id}
                  className="hover:bg-[#1F1F1F] transition-colors"
                  style={{ backgroundColor: i % 2 === 0 ? "#1A1A1A" : "#141414" }}
                >
                  <td className="px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>{p.id}</td>
                  <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{p.descricao}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "#2A2422", color: "#9A9A9A" }}>{p.moeda}</span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "13px" }}>
                    {fmt(p.valor)}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px" }}>{p.vencimento}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.urgencia} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid #2A2422" }}>
                <td colSpan={3} className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px" }}>
                  {pendingPayments.length} pagamentos pendentes
                </td>
                <td className="px-4 py-3" style={{ color: "#C9A84C", fontWeight: 700, fontSize: "13px" }}>
                  {fmt(totalPendente)} AOA
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}