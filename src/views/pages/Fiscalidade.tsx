import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Calendar, Download } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { SectionCard } from "../components/shared/SectionCard";
import { StatusBadge } from "../components/shared/StatusBadge";
import { KPICard } from "../components/shared/KPICard";

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 0 }).format(v);

interface TaxObligation {
  id: string;
  imposto: string;
  descricao: string;
  vencimento: string;
  valor: number;
  estado: "Entregue" | "Pendente" | "Atrasado" | "Em curso";
  referencia?: string;
  entidade: string;
}

const obligations: TaxObligation[] = [
  { id: "OBR-001", imposto: "IVA", descricao: "Declaração Mensal de IVA — Março 2025", vencimento: "15/04/2025", valor: 6580000, estado: "Pendente", entidade: "AGT" },
  { id: "OBR-002", imposto: "INSS", descricao: "Contribuição INSS — Março 2025", vencimento: "10/04/2025", valor: 1904000, estado: "Pendente", entidade: "INSS" },
  { id: "OBR-003", imposto: "IRT", descricao: "IRT Retido na Fonte — Março 2025", vencimento: "10/04/2025", valor: 1785000, estado: "Pendente", entidade: "AGT" },
  { id: "OBR-004", imposto: "IVA", descricao: "Declaração Mensal de IVA — Fevereiro 2025", vencimento: "15/03/2025", valor: 5670000, estado: "Entregue", referencia: "AGT-2025/03-1234", entidade: "AGT" },
  { id: "OBR-005", imposto: "INSS", descricao: "Contribuição INSS — Fevereiro 2025", vencimento: "10/03/2025", valor: 1904000, estado: "Entregue", referencia: "INSS-2025/03-0087", entidade: "INSS" },
  { id: "OBR-006", imposto: "IRT", descricao: "IRT Retido na Fonte — Fevereiro 2025", vencimento: "10/03/2025", valor: 1785000, estado: "Entregue", referencia: "AGT-2025/03-0342", entidade: "AGT" },
  { id: "OBR-007", imposto: "IR", descricao: "Imposto Industrial — Estimativa Q1 2025", vencimento: "30/04/2025", valor: 12000000, estado: "Em curso", entidade: "AGT" },
];

const totalPendente = obligations.filter((o) => o.estado === "Pendente" || o.estado === "Atrasado").reduce((s, o) => s + o.valor, 0);
const totalEntregue = obligations.filter((o) => o.estado === "Entregue").reduce((s, o) => s + o.valor, 0);

const ivaDeclarations = [
  { mes: "Jan 2025", base: 38500000, iva: 5390000, estado: "Entregue" },
  { mes: "Fev 2025", base: 40500000, iva: 5670000, estado: "Entregue" },
  { mes: "Mar 2025", base: 47000000, iva: 6580000, estado: "Pendente" },
];

const inssHistory = [
  { mes: "Jan 2025", empregado: 714000, empregador: 1904000, total: 2618000, estado: "Entregue" },
  { mes: "Fev 2025", empregado: 714000, empregador: 1904000, total: 2618000, estado: "Entregue" },
  { mes: "Mar 2025", empregado: 714000, empregador: 1904000, total: 2618000, estado: "Pendente" },
];

type Tab = "obrigacoes" | "iva" | "inss" | "irt";

export default function Fiscalidade() {
  const [activeTab, setActiveTab] = useState<Tab>("obrigacoes");

  const tabs: { key: Tab; label: string }[] = [
    { key: "obrigacoes", label: "Obrigações Fiscais" },
    { key: "iva", label: "IVA" },
    { key: "inss", label: "INSS" },
    { key: "irt", label: "IRT" },
  ];

  const estadoIcon = (estado: string) => {
    if (estado === "Entregue") return <CheckCircle size={14} style={{ color: "#10B981" }} />;
    if (estado === "Atrasado") return <AlertTriangle size={14} style={{ color: "#EF4444" }} />;
    if (estado === "Em curso") return <Clock size={14} style={{ color: "var(--primary)" }} />;
    return <Clock size={14} style={{ color: "#C9A84C" }} />;
  };

  const impostoColors: Record<string, string> = {
    IVA: "#3B82F6",
    INSS: "#8B5CF6",
    IRT: "var(--primary)",
    IR: "#10B981",
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        icon={Shield}
        title="Fiscalidade"
        subtitle="Gestão de obrigações fiscais — AGT / INSS"
        actions={
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md"
            style={{ border: "1px solid #2A2422", color: "#9A9A9A", fontSize: "13px" }}
          >
            <Download size={14} /> Exportar Mapa
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="A Liquidar" value={`${(totalPendente / 1000000).toFixed(1)}M AOA`} icon={AlertTriangle} change="3 obrigações" trend="down" />
        <KPICard title="Entregue (YTD)" value={`${(totalEntregue / 1000000).toFixed(1)}M AOA`} icon={CheckCircle} change="6 obrigações" trend="up" />
        <KPICard title="IVA (Mar)" value={`${(6580000 / 1000000).toFixed(1)}M AOA`} subtitle="Taxa 14%" icon={FileText} />
        <KPICard title="INSS (Mar)" value={`${(2618000 / 1000000).toFixed(1)}M AOA`} subtitle="3% + 8%" icon={Shield} accent />
      </div>

      {/* Alert for upcoming obligations */}
      <div
        className="flex items-start gap-3 p-4 rounded-lg"
        style={{ backgroundColor: "#C9A84C15", border: "1px solid #C9A84C40" }}
      >
        <AlertTriangle size={18} style={{ color: "#F59E0B", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p style={{ color: "#F59E0B", fontWeight: 600, fontSize: "14px" }}>Obrigações com vencimento próximo</p>
          <p style={{ color: "#9A9A9A", fontSize: "13px", marginTop: "2px" }}>
            INSS e IRT vencem em <strong style={{ color: "var(--text-primary)" }}>10/04/2025</strong>. IVA de Março vence em <strong style={{ color: "var(--text-primary)" }}>15/04/2025</strong>. Total a liquidar: <strong style={{ color: "var(--primary)" }}>{fmt(totalPendente)} AOA</strong>.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <SectionCard title="" noPadding>
        <div className="flex border-b overflow-x-auto" style={{ borderColor: "#2A2422" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-5 py-3 transition-colors whitespace-nowrap relative"
              style={{
                color: activeTab === tab.key ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: activeTab === tab.key ? 600 : 500,
                fontSize: "13px",
              }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "var(--primary)" }} />
              )}
            </button>
          ))}
        </div>

        {/* Obrigações Tab */}
        {activeTab === "obrigacoes" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Imposto</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Descrição</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Entidade</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Vencimento</th>
                  <th className="text-right px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Valor (AOA)</th>
                  <th className="text-center px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Estado</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Referência</th>
                </tr>
              </thead>
              <tbody>
                {obligations.map((o, i) => (
                  <tr
                    key={o.id}
                    className="hover:bg-[#1F1F1F] transition-colors"
                    style={{ backgroundColor: i % 2 === 0 ? "#1A1A1A" : "#141414" }}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${impostoColors[o.imposto] || "#6B7280"}20`,
                          color: impostoColors[o.imposto] || "#6B7280",
                          fontWeight: 700,
                        }}
                      >
                        {o.imposto}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{o.descricao}</td>
                    <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "13px" }}>{o.entidade}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} style={{ color: "#9A9A9A" }} />
                        <span style={{ color: "#9A9A9A", fontSize: "13px" }}>{o.vencimento}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right" style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "13px" }}>
                      {fmt(o.valor)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {estadoIcon(o.estado)}
                        <StatusBadge
                          status={o.estado}
                          variant={o.estado === "Entregue" ? "success" : o.estado === "Atrasado" ? "danger" : o.estado === "Em curso" ? "info" : "warning"}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 500 }}>
                      {o.referencia || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* IVA Tab */}
        {activeTab === "iva" && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#0F0F0F" }}>
                <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Taxa IVA</p>
                <p style={{ color: "#3B82F6", fontWeight: 700, fontSize: "28px" }}>14%</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#0F0F0F" }}>
                <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Base Tributável (Mar)</p>
                <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "20px" }}>{fmt(47000000)}</p>
                <p style={{ color: "#9A9A9A", fontSize: "11px" }}>AOA</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#0F0F0F" }}>
                <p style={{ color: "#9A9A9A", fontSize: "12px" }}>IVA a Liquidar (Mar)</p>
                <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "20px" }}>{fmt(6580000)}</p>
                <p style={{ color: "#9A9A9A", fontSize: "11px" }}>AOA</p>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                  {["Mês", "Base Tributável (AOA)", "IVA (14%)", "Estado"].map((h) => (
                    <th key={h} className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ivaDeclarations.map((d, i) => (
                  <tr key={d.mes} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "#141414" }}>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{d.mes}</td>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{fmt(d.base)}</td>
                    <td className="px-4 py-3" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "13px" }}>{fmt(d.iva)}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.estado} variant={d.estado === "Entregue" ? "success" : "warning"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* INSS Tab */}
        {activeTab === "inss" && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#0F0F0F" }}>
                <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Taxa Empregado</p>
                <p style={{ color: "#8B5CF6", fontWeight: 700, fontSize: "28px" }}>3%</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#0F0F0F" }}>
                <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Taxa Empregador</p>
                <p style={{ color: "#8B5CF6", fontWeight: 700, fontSize: "28px" }}>8%</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#0F0F0F" }}>
                <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Prazo de Entrega</p>
                <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "18px" }}>Dia 10</p>
                <p style={{ color: "#9A9A9A", fontSize: "11px" }}>do mês seguinte</p>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                  {["Mês", "INSS Empregado (3%)", "INSS Empregador (8%)", "Total", "Estado"].map((h) => (
                    <th key={h} className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inssHistory.map((d, i) => (
                  <tr key={d.mes} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "#141414" }}>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{d.mes}</td>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{fmt(d.empregado)}</td>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{fmt(d.empregador)}</td>
                    <td className="px-4 py-3" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "13px" }}>{fmt(d.total)}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.estado} variant={d.estado === "Entregue" ? "success" : "warning"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* IRT Tab */}
        {activeTab === "irt" && (
          <div className="p-6 space-y-4">
            <p style={{ color: "#9A9A9A", fontSize: "13px", marginBottom: "16px" }}>
              Escalões IRT aplicáveis — Decreto Presidencial n.º 3/14 (revisto)
            </p>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                  {["Escalão", "Rendimento Mínimo (AOA)", "Rendimento Máximo (AOA)", "Taxa Marginal", "Parcela a Abater"].map((h) => (
                    <th key={h} className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { esc: "1º", min: 0, max: 34450, taxa: "0%", parcela: "—" },
                  { esc: "2º", min: 34451, max: 35000, taxa: "10%", parcela: "3.445" },
                  { esc: "3º", min: 35001, max: 40000, taxa: "13%", parcela: "4.496" },
                  { esc: "4º", min: 40001, max: 45000, taxa: "16%", parcela: "5.696" },
                  { esc: "5º", min: 45001, max: 50000, taxa: "18%", parcela: "6.596" },
                  { esc: "6º", min: 50001, max: 70000, taxa: "19%", parcela: "7.096" },
                  { esc: "7º", min: 70001, max: 0, taxa: "25%", parcela: "11.296" },
                ].map((row, i) => (
                  <tr key={row.esc} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "#141414" }}>
                    <td className="px-4 py-3" style={{ color: "var(--primary)", fontWeight: 700, fontSize: "13px" }}>{row.esc}</td>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{row.min === 0 ? "—" : fmt(row.min)}</td>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{row.max === 0 ? "Ilimitado" : fmt(row.max)}</td>
                    <td className="px-4 py-3">
                      <span style={{ color: row.taxa === "0%" ? "#10B981" : "#EF4444", fontWeight: 700, fontSize: "14px" }}>{row.taxa}</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "13px" }}>{row.parcela}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}