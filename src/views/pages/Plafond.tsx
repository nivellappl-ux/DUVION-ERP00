import { useState } from "react";
import { Layers, AlertTriangle, Plus, TrendingUp, Edit2, Check } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { SectionCard } from "../components/shared/SectionCard";
import { KPICard } from "../components/shared/KPICard";

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 0 }).format(v);

interface Department {
  id: string;
  nome: string;
  responsavel: string;
  plafond: number;
  usado: number;
  cor: string;
}

const departments: Department[] = [
  { id: "D1", nome: "Comercial", responsavel: "Carlos Fernandes", plafond: 15000000, usado: 12800000, cor: "#2563EB" },
  { id: "D2", nome: "Tecnologia", responsavel: "Pedro Costa", plafond: 8000000, usado: 7600000, cor: "#EF4444" },
  { id: "D3", nome: "Marketing", responsavel: "Beatriz Lopes", plafond: 6000000, usado: 3200000, cor: "#10B981" },
  { id: "D4", nome: "RH", responsavel: "Ana Mendes", plafond: 4000000, usado: 2900000, cor: "#3B82F6" },
  { id: "D5", nome: "Operações", responsavel: "Ricardo Gomes", plafond: 10000000, usado: 9200000, cor: "#F59E0B" },
  { id: "D6", nome: "Jurídico", responsavel: "Sofia Rodrigues", plafond: 3000000, usado: 1800000, cor: "#8B5CF6" },
  { id: "D7", nome: "Administração", responsavel: "João Silva", plafond: 5000000, usado: 4100000, cor: "#EC4899" },
];

interface PlafondHistory {
  mes: string;
  total: number;
  usado: number;
}

const history: PlafondHistory[] = [
  { mes: "Jan", total: 51000000, usado: 38500000 },
  { mes: "Fev", total: 51000000, usado: 41200000 },
  { mes: "Mar", total: 51000000, usado: 41600000 },
];

export default function Plafond() {
  const [selected, setSelected] = useState<Department | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState("");

  const totalPlafond = departments.reduce((s, d) => s + d.plafond, 0);
  const totalUsado = departments.reduce((s, d) => s + d.usado, 0);
  const totalDisponivel = totalPlafond - totalUsado;
  const usagePercent = Math.round((totalUsado / totalPlafond) * 100);

  const getUsageColor = (pct: number) => {
    if (pct >= 90) return "#EF4444";
    if (pct >= 75) return "#F59E0B";
    return "#10B981";
  };

  const alertDepts = departments.filter((d) => (d.usado / d.plafond) >= 0.85);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        icon={Layers}
        title="Plafond"
        subtitle="Controlo de orçamento por departamento"
        actions={
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#C9A84C", color: "#0F0F0F", fontWeight: 600, fontSize: "13px" }}
          >
            <Plus size={15} />
            Novo Departamento
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Plafond Total" value={`${(totalPlafond / 1000000).toFixed(0)}M AOA`} icon={Layers} />
        <KPICard title="Total Usado" value={`${(totalUsado / 1000000).toFixed(1)}M AOA`} icon={TrendingUp} change={`${usagePercent}%`} trend={usagePercent > 80 ? "down" : "neutral"} />
        <KPICard title="Disponível" value={`${(totalDisponivel / 1000000).toFixed(1)}M AOA`} icon={Check} change={`${100 - usagePercent}% livre`} trend="up" accent />
        <KPICard title="Departamentos em Alerta" value={`${alertDepts.length}`} subtitle="≥ 85% do plafond" icon={AlertTriangle} trend={alertDepts.length > 0 ? "down" : "up"} />
      </div>

      {/* Global Progress */}
      <div className="p-5 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "14px" }}>Execução Orçamental Global — Março 2025</p>
            <p style={{ color: "#9A9A9A", fontSize: "12px" }}>{fmt(totalUsado)} AOA usados de {fmt(totalPlafond)} AOA</p>
          </div>
          <span style={{ color: getUsageColor(usagePercent), fontWeight: 700, fontSize: "22px" }}>{usagePercent}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#0F0F0F" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${usagePercent}%`, backgroundColor: getUsageColor(usagePercent) }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span style={{ color: "#9A9A9A", fontSize: "11px" }}>0%</span>
          <span style={{ color: "#F59E0B", fontSize: "11px" }}>Alerta: 75%</span>
          <span style={{ color: "#EF4444", fontSize: "11px" }}>Crítico: 90%</span>
          <span style={{ color: "#9A9A9A", fontSize: "11px" }}>100%</span>
        </div>
      </div>

      {/* Alerts */}
      {alertDepts.length > 0 && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#EF444415", border: "1px solid #EF444440" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} style={{ color: "#EF4444" }} />
            <p style={{ color: "#EF4444", fontWeight: 600, fontSize: "14px" }}>
              {alertDepts.length} departamento{alertDepts.length > 1 ? "s" : ""} com plafond quase esgotado
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {alertDepts.map((d) => (
              <span
                key={d.id}
                className="px-3 py-1 rounded-full text-xs"
                style={{ backgroundColor: "#EF444420", color: "#EF4444", fontWeight: 600 }}
              >
                {d.nome} — {Math.round((d.usado / d.plafond) * 100)}%
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Cards */}
        <div className="lg:col-span-2 space-y-3">
          <h3 style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
            Por Departamento
          </h3>
          {departments.map((dept) => {
            const pct = Math.round((dept.usado / dept.plafond) * 100);
            const color = getUsageColor(pct);
            const isSelected = selected?.id === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelected(isSelected ? null : dept)}
                className="w-full text-left p-4 rounded-lg transition-colors"
                style={{
                  backgroundColor: isSelected ? "#2A2422" : "#1A1A1A",
                  border: `1px solid ${isSelected ? dept.cor : "#2A2422"}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.cor }}
                    />
                    <span style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "14px" }}>{dept.nome}</span>
                    <span style={{ color: "#9A9A9A", fontSize: "12px" }}>({dept.responsavel})</span>
                  </div>
                  <span style={{ color, fontWeight: 700, fontSize: "14px" }}>{pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: "#0F0F0F" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
                  />
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#9A9A9A", fontSize: "11px" }}>
                    Usado: {fmt(dept.usado)} AOA
                  </span>
                  <span style={{ color: "#9A9A9A", fontSize: "11px" }}>
                    Plafond: {fmt(dept.plafond)} AOA
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {selected ? (
            <SectionCard
              title={selected.nome}
              subtitle={`Responsável: ${selected.responsavel}`}
              actions={
                <button
                  onClick={() => { setEditMode(!editMode); setEditValue(String(selected.plafond)); }}
                  className="p-1.5 rounded"
                  style={{ color: "#9A9A9A" }}
                >
                  <Edit2 size={14} />
                </button>
              }
            >
              <div className="space-y-4">
                {[
                  { label: "Plafond Atribuído", value: fmt(selected.plafond), color: "#F5F5F5" },
                  { label: "Montante Usado", value: fmt(selected.usado), color: "#EF4444" },
                  { label: "Disponível", value: fmt(selected.plafond - selected.usado), color: "#10B981" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b" style={{ borderColor: "#2A2422" }}>
                    <span style={{ color: "#9A9A9A", fontSize: "13px" }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700, fontSize: "14px" }}>{item.value} AOA</span>
                  </div>
                ))}

                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: "#9A9A9A", fontSize: "12px" }}>Taxa de Execução</span>
                    <span style={{ color: getUsageColor(Math.round((selected.usado / selected.plafond) * 100)), fontWeight: 700, fontSize: "16px" }}>
                      {Math.round((selected.usado / selected.plafond) * 100)}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#0F0F0F" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(Math.round((selected.usado / selected.plafond) * 100), 100)}%`,
                        backgroundColor: getUsageColor(Math.round((selected.usado / selected.plafond) * 100)),
                      }}
                    />
                  </div>
                </div>

                {editMode && (
                  <div>
                    <label style={{ color: "#9A9A9A", fontSize: "12px" }}>Novo Plafond (AOA)</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-3 py-2 rounded border focus:outline-none text-sm"
                        style={{ backgroundColor: "#0F0F0F", borderColor: "#C9A84C", color: "#F5F5F5" }}
                      />
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-3 py-2 rounded transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#C9A84C", color: "#0F0F0F", fontWeight: 600, fontSize: "13px" }}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <p style={{ color: "#9A9A9A", fontSize: "12px", marginBottom: "8px" }}>Histórico (3 meses)</p>
                  {history.map((h) => (
                    <div key={h.mes} className="flex items-center gap-2 mb-2">
                      <span style={{ color: "#9A9A9A", fontSize: "12px", width: "32px" }}>{h.mes}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#0F0F0F" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.round((h.usado / h.total) * 100)}%`, backgroundColor: "var(--primary)" }}
                        />
                      </div>
                      <span style={{ color: "#9A9A9A", fontSize: "11px" }}>
                        {Math.round((h.usado / h.total) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          ) : (
            <div
              className="p-6 rounded-lg flex flex-col items-center justify-center text-center"
              style={{ backgroundColor: "#1A1A1A", border: "1px dashed #2A2422", minHeight: "200px" }}
            >
              <Layers size={32} style={{ color: "#2A2422", marginBottom: "12px" }} />
              <p style={{ color: "#9A9A9A", fontSize: "13px" }}>Selecione um departamento para ver detalhes</p>
            </div>
          )}

          {/* Summary Table */}
          <SectionCard title="Resumo Geral" noPadding>
            <div className="divide-y" style={{ borderColor: "#2A2422" }}>
              {departments.map((d) => {
                const pct = Math.round((d.usado / d.plafond) * 100);
                return (
                  <div key={d.id} className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.cor }} />
                      <span style={{ color: "#F5F5F5", fontSize: "12px" }}>{d.nome}</span>
                    </div>
                    <span style={{ color: getUsageColor(pct), fontWeight: 700, fontSize: "12px" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}