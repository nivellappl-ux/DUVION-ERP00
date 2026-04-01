import { useState } from "react";
import { Settings, Building, Users, Globe, Shield, Bell, Database, Save, Plus, Trash2, Check } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";

type Tab = "empresa" | "utilizadores" | "fiscal" | "notificacoes" | "sistema";

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  estado: "Ativo" | "Inativo";
  avatar: string;
}

const users: User[] = [
  { id: "1", nome: "João Silva", email: "joao.silva@duvion.ao", perfil: "Administrador", estado: "Ativo", avatar: "JS" },
  { id: "2", nome: "Maria Santos", email: "maria.santos@duvion.ao", perfil: "Contabilista", estado: "Ativo", avatar: "MS" },
  { id: "3", nome: "Pedro Costa", email: "pedro.costa@duvion.ao", perfil: "Técnico TI", estado: "Ativo", avatar: "PC" },
  { id: "4", nome: "Ana Mendes", email: "ana.mendes@duvion.ao", perfil: "RH Manager", estado: "Inativo", avatar: "AM" },
];

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "empresa", label: "Empresa", icon: Building },
  { key: "utilizadores", label: "Utilizadores", icon: Users },
  { key: "fiscal", label: "Configuração Fiscal", icon: Shield },
  { key: "notificacoes", label: "Notificações", icon: Bell },
  { key: "sistema", label: "Sistema", icon: Database },
];

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  readOnly?: boolean;
  placeholder?: string;
}) => (
  <div>
    <label className="block mb-1.5" style={{ color: "#9A9A9A", fontSize: "12px", fontWeight: 500 }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded border focus:outline-none text-sm transition-colors"
      style={{
        backgroundColor: readOnly ? "#141414" : "#0F0F0F",
        borderColor: "#2A2422",
        color: readOnly ? "#9A9A9A" : "#F5F5F5",
        cursor: readOnly ? "not-allowed" : "text",
      }}
      onFocus={(e) => { if (!readOnly) e.target.style.borderColor = "var(--primary)"; }}
      onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
    />
  </div>
);

const ToggleSetting = ({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "#2A2422" }}>
    <div>
      <p style={{ color: "#F5F5F5", fontSize: "14px", fontWeight: 500 }}>{label}</p>
      {description && <p style={{ color: "#9A9A9A", fontSize: "12px", marginTop: "2px" }}>{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-11 h-6 rounded-full transition-colors"
      style={{ backgroundColor: enabled ? "var(--primary)" : "var(--border)" }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full transition-transform"
        style={{
          backgroundColor: "#F5F5F5",
          transform: enabled ? "translateX(22px)" : "translateX(2px)",
        }}
      />
    </button>
  </div>
);

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState<Tab>("empresa");
  const [saved, setSaved] = useState(false);
  const [empresa, setEmpresa] = useState({
    nome: "Duvion Lda",
    nif: "5417123456",
    telefone: "+244 222 123 456",
    email: "geral@duvion.ao",
    endereco: "Rua Rainha Ginga, 123, Luanda",
    provincia: "Luanda",
    pais: "Angola",
    website: "www.duvion.ao",
    capital: "50.000.000 AOA",
    actividade: "Consultoria e Tecnologia",
  });
  const [fiscalConfig, setFiscalConfig] = useState({
    taxaIVA: "14",
    serieFatura: "FT",
    proximoNumero: "246",
    inssEmpregado: "3",
    inssEmpregador: "8",
    taxaBNA: "850",
    regimeIVA: "Regime Geral",
  });
  const [notifs, setNotifs] = useState({
    fatVencidas: true,
    pagamentosProximos: true,
    inssVencimento: true,
    ivaVencimento: true,
    plafondAlerta: true,
    relatorioMensal: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        icon={Settings}
        title="Configurações"
        subtitle="Gestão do sistema e preferências"
        actions={
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
            style={{
              backgroundColor: saved ? "#10B981" : "var(--primary)",
              color: "#0F0F0F",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {saved ? <Check size={15} /> : <Save size={15} />}
            {saved ? "Guardado!" : "Guardar Alterações"}
          </button>
        }
      />

      <div className="flex gap-6">
        {/* Tab Sidebar */}
        <div className="w-48 flex-shrink-0">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-left"
                  style={{
                    backgroundColor: isActive ? "#2A2422" : "transparent",
                    color: isActive ? "var(--primary)" : "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#F5F5F5"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <Icon size={15} />
                  <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-lg p-6" style={{ backgroundColor: "#1A1A1A" }}>
          {/* Empresa Tab */}
          {activeTab === "empresa" && (
            <div className="space-y-4">
              <h3 style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "16px", marginBottom: "20px" }}>
                Dados da Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Nome da Empresa" value={empresa.nome} onChange={(v) => setEmpresa({ ...empresa, nome: v })} />
                <InputField label="NIF" value={empresa.nif} onChange={(v) => setEmpresa({ ...empresa, nif: v })} />
                <InputField label="Telefone" value={empresa.telefone} onChange={(v) => setEmpresa({ ...empresa, telefone: v })} />
                <InputField label="Email" type="email" value={empresa.email} onChange={(v) => setEmpresa({ ...empresa, email: v })} />
                <div className="md:col-span-2">
                  <InputField label="Endereço" value={empresa.endereco} onChange={(v) => setEmpresa({ ...empresa, endereco: v })} />
                </div>
                <InputField label="Província" value={empresa.provincia} onChange={(v) => setEmpresa({ ...empresa, provincia: v })} />
                <InputField label="País" value={empresa.pais} readOnly />
                <InputField label="Website" value={empresa.website} onChange={(v) => setEmpresa({ ...empresa, website: v })} />
                <InputField label="Capital Social" value={empresa.capital} onChange={(v) => setEmpresa({ ...empresa, capital: v })} />
                <div className="md:col-span-2">
                  <InputField label="Actividade Principal" value={empresa.actividade} onChange={(v) => setEmpresa({ ...empresa, actividade: v })} />
                </div>
              </div>

              <div
                className="p-4 rounded-lg mt-4"
                style={{ backgroundColor: "rgba(37,99,235,0.09)", border: "1px solid rgba(37,99,235,0.3)" }}
              >
                <p style={{ color: "var(--primary)", fontSize: "13px", fontWeight: 500 }}>
                  ℹ️ Os dados da empresa são utilizados para emissão de faturas e documentos fiscais conforme exigido pela AGT.
                </p>
              </div>
            </div>
          )}

          {/* Utilizadores Tab */}
          {activeTab === "utilizadores" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "16px" }}>Gestão de Utilizadores</h3>
                <button
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md"
                  style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: "13px" }}
                >
                  <Plus size={14} /> Convidar
                </button>
              </div>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ backgroundColor: "#0F0F0F", border: "1px solid #2A2422" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "12px" }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <p style={{ color: "#F5F5F5", fontSize: "14px", fontWeight: 500 }}>{user.nome}</p>
                        <p style={{ color: "#9A9A9A", fontSize: "12px" }}>{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="px-2.5 py-1 rounded text-xs"
                        style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "var(--primary)", fontWeight: 600 }}
                      >
                        {user.perfil}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: user.estado === "Ativo" ? "#10B98120" : "#6B728020",
                          color: user.estado === "Ativo" ? "#10B981" : "#6B7280",
                          fontWeight: 600,
                        }}
                      >
                        {user.estado}
                      </span>
                      <button className="p-1.5 rounded transition-colors hover:bg-[#2A2422]" style={{ color: "#EF4444" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fiscal Tab */}
          {activeTab === "fiscal" && (
            <div className="space-y-4">
              <h3 style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "16px", marginBottom: "20px" }}>
                Configuração Fiscal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Taxa de IVA (%)" value={fiscalConfig.taxaIVA} onChange={(v) => setFiscalConfig({ ...fiscalConfig, taxaIVA: v })} type="number" />
                <InputField label="Regime de IVA" value={fiscalConfig.regimeIVA} onChange={(v) => setFiscalConfig({ ...fiscalConfig, regimeIVA: v })} />
                <InputField label="Série de Fatura (AGT)" value={fiscalConfig.serieFatura} onChange={(v) => setFiscalConfig({ ...fiscalConfig, serieFatura: v })} />
                <InputField label="Próximo Número de Fatura" value={fiscalConfig.proximoNumero} onChange={(v) => setFiscalConfig({ ...fiscalConfig, proximoNumero: v })} />
                <InputField label="INSS Empregado (%)" value={fiscalConfig.inssEmpregado} onChange={(v) => setFiscalConfig({ ...fiscalConfig, inssEmpregado: v })} type="number" />
                <InputField label="INSS Empregador (%)" value={fiscalConfig.inssEmpregador} onChange={(v) => setFiscalConfig({ ...fiscalConfig, inssEmpregador: v })} type="number" />
                <InputField label="Taxa BNA (USD/AOA)" value={fiscalConfig.taxaBNA} onChange={(v) => setFiscalConfig({ ...fiscalConfig, taxaBNA: v })} type="number" />
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#3B82F615", border: "1px solid #3B82F640" }}>
                <p style={{ color: "#3B82F6", fontSize: "13px", fontWeight: 500 }}>
                  📋 Série de Fatura atual: <strong>{fiscalConfig.serieFatura} {new Date().getFullYear()}/{fiscalConfig.proximoNumero}</strong> — Conforme regulamentação AGT.
                </p>
              </div>
            </div>
          )}

          {/* Notificações Tab */}
          {activeTab === "notificacoes" && (
            <div className="space-y-1">
              <h3 style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "16px", marginBottom: "20px" }}>
                Preferências de Notificação
              </h3>
              <ToggleSetting
                label="Faturas Vencidas"
                description="Alertas para faturas não pagas após a data de vencimento"
                enabled={notifs.fatVencidas}
                onChange={(v) => setNotifs({ ...notifs, fatVencidas: v })}
              />
              <ToggleSetting
                label="Pagamentos Próximos"
                description="Avisos 3 dias antes de vencimento de pagamentos"
                enabled={notifs.pagamentosProximos}
                onChange={(v) => setNotifs({ ...notifs, pagamentosProximos: v })}
              />
              <ToggleSetting
                label="Vencimento INSS"
                description="Aviso antes do dia 10 de cada mês"
                enabled={notifs.inssVencimento}
                onChange={(v) => setNotifs({ ...notifs, inssVencimento: v })}
              />
              <ToggleSetting
                label="Vencimento IVA"
                description="Aviso antes do dia 15 de cada mês"
                enabled={notifs.ivaVencimento}
                onChange={(v) => setNotifs({ ...notifs, ivaVencimento: v })}
              />
              <ToggleSetting
                label="Alertas de Plafond"
                description="Quando um departamento atingir 85% do orçamento"
                enabled={notifs.plafondAlerta}
                onChange={(v) => setNotifs({ ...notifs, plafondAlerta: v })}
              />
              <ToggleSetting
                label="Relatório Mensal Automático"
                description="Envio de relatório consolidado no início de cada mês"
                enabled={notifs.relatorioMensal}
                onChange={(v) => setNotifs({ ...notifs, relatorioMensal: v })}
              />
            </div>
          )}

          {/* Sistema Tab */}
          {activeTab === "sistema" && (
            <div className="space-y-4">
              <h3 style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "16px", marginBottom: "20px" }}>
                Informações do Sistema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Versão do Sistema", value: "Duvion ERP v2.1.0" },
                  { label: "Ambiente", value: "Produção" },
                  { label: "Base de Dados", value: "PostgreSQL 15.2" },
                  { label: "Último Backup", value: "31/03/2025 02:00" },
                  { label: "Espaço Utilizado", value: "2.4 GB / 10 GB" },
                  { label: "Utilizadores Activos", value: "3 / 10 licenças" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg" style={{ backgroundColor: "#0F0F0F" }}>
                    <p style={{ color: "#9A9A9A", fontSize: "11px", marginBottom: "4px" }}>{item.label}</p>
                    <p style={{ color: "#F5F5F5", fontSize: "14px", fontWeight: 600 }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-lg mt-2" style={{ backgroundColor: "#0F0F0F", border: "1px solid #2A2422" }}>
                <p style={{ color: "#F5F5F5", fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Acções do Sistema</p>
                <div className="flex flex-wrap gap-2">
                  {["Fazer Backup Agora", "Exportar Dados", "Limpar Cache", "Ver Logs"].map((action) => (
                    <button
                      key={action}
                      className="px-3 py-2 rounded text-xs transition-colors hover:bg-[#2A2422]"
                      style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#EF444415", border: "1px solid #EF444440" }}>
                <p style={{ color: "#EF4444", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Zona Perigosa</p>
                <p style={{ color: "#9A9A9A", fontSize: "12px", marginBottom: "12px" }}>Estas acções são irreversíveis. Proceda com cuidado.</p>
                <button
                  className="px-4 py-2 rounded text-xs"
                  style={{ border: "1px solid #EF4444", color: "#EF4444", fontWeight: 600 }}
                >
                  Repor Base de Dados de Teste
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}