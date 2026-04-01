import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  Menu,
  DollarSign,
  Users,
  TrendingUp,
  WifiOff,
  Plus
} from "lucide-react";

const kpiCards = [
  { 
    title: "Receita do Mês", 
    value: "67.5M", 
    currency: "AOA",
    change: "+12.5%", 
    icon: DollarSign,
    color: "#2563EB"
  },
  { 
    title: "Faturas Emitidas", 
    value: "245", 
    change: "+8.2%", 
    icon: FileText,
    color: "#60A5FA"
  },
  { 
    title: "Saldo em Caixa", 
    value: "142.8M", 
    currency: "AOA",
    change: "+5.1%", 
    icon: Wallet,
    color: "#1D4ED8"
  },
  { 
    title: "Funcionários", 
    value: "127", 
    change: "+3", 
    icon: Users,
    color: "#2563EB"
  },
];

export default function MobileDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOffline] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: '#0F0F0F',
        maxWidth: '390px',
        margin: '0 auto'
      }}
    >
      {/* Header */}
      <header 
        className="px-4 py-4 flex items-center justify-between border-b"
        style={{ 
          backgroundColor: '#1A1A1A',
          borderColor: '#2A2422'
        }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            <Menu size={24} style={{ color: '#2563EB' }} />
          </button>
          <h1 className="text-xl" style={{ color: '#2563EB', fontWeight: 700 }}>
            Duvion
          </h1>
        </div>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#2563EB', color: '#ffffff', fontWeight: 700 }}
        >
          JD
        </div>
      </header>

      {/* Offline Banner */}
      {isOffline && (
        <div 
          className="px-4 py-3 flex items-center gap-2"
          style={{ backgroundColor: '#2563EB' }}
        >
          <WifiOff size={18} style={{ color: '#0F0F0F' }} />
          <span style={{ color: '#0F0F0F', fontWeight: 500, fontSize: '14px' }}>
            Modo Offline - Dados em cache
          </span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 space-y-4 pb-20">
        {/* KPI Cards - Vertical */}
        <div className="space-y-3">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            
            return (
              <div
                key={kpi.title}
                className="p-4 rounded-lg flex items-center justify-between"
                style={{ backgroundColor: '#1A1A1A' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-md"
                    style={{ backgroundColor: '#2A2422' }}
                  >
                    <Icon size={20} style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#9A9A9A' }}>
                      {kpi.title}
                    </p>
                    <p className="text-xl" style={{ color: '#F5F5F5', fontWeight: 700 }}>
                      {kpi.value}
                      {kpi.currency && (
                        <span className="text-sm ml-1" style={{ color: '#9A9A9A', fontWeight: 500 }}>
                          {kpi.currency}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} style={{ color: '#10B981' }} />
                  <span className="text-xs" style={{ color: '#10B981', fontWeight: 500 }}>
                    {kpi.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="mb-3 text-sm" style={{ color: '#9A9A9A', fontWeight: 500 }}>
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <button
              className="w-full p-4 rounded-lg flex items-center justify-between transition-opacity active:opacity-70"
              style={{
                backgroundColor: '#C9A84C',
                color: '#0F0F0F',
              }}
            >
              <div className="flex items-center gap-3">
                <FileText size={20} />
                <span style={{ fontWeight: 500 }}>Emitir Fatura</span>
              </div>
              <Plus size={20} />
            </button>

            <button
              className="w-full p-4 rounded-lg flex items-center justify-between border transition-colors active:bg-[#2A2422]"
              style={{
                backgroundColor: '#1A1A1A',
                borderColor: '#C9A84C',
                color: '#C9A84C',
              }}
            >
              <div className="flex items-center gap-3">
                <Wallet size={20} />
                <span style={{ fontWeight: 500 }}>Ver Estoque</span>
              </div>
            </button>

            <button
              className="w-full p-4 rounded-lg flex items-center justify-between border transition-colors active:bg-[#2A2422]"
              style={{
                backgroundColor: '#1A1A1A',
                borderColor: '#C9A84C',
                color: '#C9A84C',
              }}
            >
              <div className="flex items-center gap-3">
                <DollarSign size={20} />
                <span style={{ fontWeight: 500 }}>Registar Pagamento</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="mb-3 text-sm" style={{ color: '#9A9A9A', fontWeight: 500 }}>
            Atividade Recente
          </h3>
          <div className="space-y-2">
            {[
              { title: "Fatura FT 2025/245", subtitle: "Sonangol E.P. - 12.5M AOA", status: "Paga" },
              { title: "Fatura FT 2025/244", subtitle: "Unitel S.A. - 8.7M AOA", status: "Pendente" },
              { title: "Fatura FT 2025/243", subtitle: "BAI - 15.2M AOA", status: "Paga" },
            ].map((item, index) => {
              const statusColors = {
                Paga: { bg: '#10B98120', text: '#10B981' },
                Pendente: { bg: '#2563EB20', text: '#2563EB' },
              };
              const colors = statusColors[item.status as keyof typeof statusColors];
              
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#1A1A1A' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: '#F5F5F5', fontWeight: 500, fontSize: '14px' }}>
                      {item.title}
                    </span>
                    <span 
                      className="px-2 py-1 rounded text-xs"
                      style={{ 
                        backgroundColor: colors.bg, 
                        color: colors.text,
                        fontWeight: 500
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p style={{ color: '#9A9A9A', fontSize: '12px' }}>
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-around border-t"
        style={{ 
          backgroundColor: '#1A1A1A',
          borderColor: '#2A2422',
          maxWidth: '390px',
          margin: '0 auto'
        }}
      >
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { id: "faturacao", icon: FileText, label: "Faturas" },
          { id: "tesouraria", icon: Wallet, label: "Caixa" },
          { id: "menu", icon: Menu, label: "Menu" },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors"
              style={{
                color: isActive ? '#2563EB' : '#9A9A9A',
              }}
            >
              <Icon size={22} />
              <span style={{ fontSize: '11px', fontWeight: 500 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}