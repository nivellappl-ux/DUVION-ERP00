import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  FileText,
  Users,
  Shield,
  Building2,
  Layers,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Wallet,
  AlertTriangle,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import duvionLogo from "figma:asset/f74fa39df10f3fd556b81d464aeb8628aaf5cd57.png";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  group?: string;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", group: "principal" },
  { icon: TrendingUp, label: "Financeiro", path: "/dashboard/financeiro", group: "financas" },
  { icon: BookOpen, label: "Diário de Caixa", path: "/dashboard/diario-caixa", group: "financas" },
  { icon: Wallet, label: "Tesouraria", path: "/dashboard/tesouraria", group: "financas" },
  { icon: Building2, label: "Conta Bancária", path: "/dashboard/conta-bancaria", group: "financas" },
  { icon: FileText, label: "Faturação", path: "/dashboard/faturacao", group: "comercial" },
  { icon: Users, label: "Recursos Humanos", path: "/dashboard/rh", group: "operacoes" },
  { icon: Layers, label: "Plafond", path: "/dashboard/plafond", group: "operacoes" },
  { icon: Shield, label: "Fiscalidade", path: "/dashboard/fiscalidade", group: "fiscal" },
  { icon: Settings, label: "Configurações", path: "/dashboard/configuracoes", group: "sistema" },
];

const groupLabels: Record<string, string> = {
  principal: "Principal",
  financas: "Finanças",
  comercial: "Comercial",
  operacoes: "Operações",
  fiscal: "Fiscal",
  sistema: "Sistema",
};

const alerts = [
  { id: "a1", type: "warning", text: "IVA vence em 15/04 — 6.58M AOA" },
  { id: "a2", type: "danger", text: "INSS vence em 10/04 — 1.9M AOA" },
  { id: "a3", type: "info", text: "2 faturas vencidas aguardam pagamento" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme, setDark, setLight } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificationCount] = useState(3);

  const handleLogout = () => {
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const currentPageLabel =
    menuItems.find((item) => isActive(item.path))?.label || "Dashboard";

  const groupedItems = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const g = item.group || "other";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const alertStyle = (type: string) => {
    if (type === "danger") return { bg: "#EF444415", border: "#EF444440", text: "#EF4444" };
    if (type === "warning") return { bg: "#F59E0B15", border: "#F59E0B40", text: "#F59E0B" };
    return { bg: "#2563EB15", border: "#2563EB40", text: "#2563EB" };
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--surface)" }}>
      {/* Logo */}
      <div
        className="px-6 py-5 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <img 
            src={duvionLogo} 
            alt="Duvion Logo" 
            className="w-10 h-10"
          />
          <div>
            <h2 style={{ color: "var(--primary)", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px" }}>
              Duvion
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "10px", marginTop: "1px", letterSpacing: "2px" }}>
              ERP ANGOLA
            </p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 rounded"
          style={{ color: "var(--text-secondary)" }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group} className="mb-5">
            <p
              className="px-3 mb-1.5"
              style={{ color: "var(--text-muted)", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px" }}
            >
              {groupLabels[group]?.toUpperCase()}
            </p>
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md mb-0.5 transition-all relative group"
                  style={{
                    backgroundColor: active ? "var(--primary-subtle, rgba(37,99,235,0.12))" : "transparent",
                    color: active ? "var(--primary)" : "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {active && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                  )}
                  <Icon size={16} />
                  <span style={{ fontSize: "13px", fontWeight: active ? 600 : 500 }}>
                    {item.label}
                  </span>
                  {active && (
                    <ChevronRight size={12} className="ml-auto" style={{ color: "var(--primary)" }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="px-4 pb-2">
        <div
          className="flex items-center rounded-lg p-1 gap-1"
          style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <button
            onClick={setDark}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all"
            style={{
              backgroundColor: isDark ? "var(--primary)" : "transparent",
              color: isDark ? "#fff" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <Moon size={13} />
            Escuro
          </button>
          <button
            onClick={setLight}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all"
            style={{
              backgroundColor: !isDark ? "var(--primary)" : "transparent",
              color: !isDark ? "#fff" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <Sun size={13} />
            Claro
          </button>
        </div>
      </div>

      {/* User Profile + Logout */}
      <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
        <div
          className="flex items-center gap-3 p-3 rounded-lg mb-2"
          style={{ backgroundColor: "var(--surface-2)" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "12px" }}
          >
            JS
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 600 }}>João Silva</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "11px" }}>Administrador</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.backgroundColor = "#EF444410"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <LogOut size={16} />
          <span style={{ fontSize: "13px", fontWeight: 500 }}>Terminar Sessão</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg)" }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "#00000070" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Desktop */}
      <aside
        className="hidden lg:flex w-60 flex-col flex-shrink-0 border-r"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 flex flex-col lg:hidden transition-transform duration-300 border-r`}
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="h-14 flex items-center justify-between px-4 md:px-6 border-b flex-shrink-0"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Duvion</span>
              <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 600 }}>
                {currentPageLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* BNA Rate Widget */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md"
              style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#10B981" }} />
              <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>BNA</span>
              <span style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 700 }}>
                1 USD = 850 AOA
              </span>
            </div>

            {/* Theme Toggle (topbar quick) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; e.currentTarget.style.color = "var(--primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              title={isDark ? "Modo Claro" : "Modo Escuro"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-md transition-colors"
                style={{ color: "var(--text-primary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--surface-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <Bell size={18} />
                {notificationCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "#fff",
                      fontSize: "9px",
                      fontWeight: 700,
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div
                    className="absolute right-0 top-10 w-80 rounded-lg z-20 overflow-hidden"
                    style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <div
                      className="px-4 py-3 border-b flex items-center justify-between"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="flex items-center gap-2">
                        <Bell size={14} style={{ color: "var(--primary)" }} />
                        <span style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: 600 }}>
                          Alertas do Sistema
                        </span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "var(--primary)", fontSize: "11px", fontWeight: 700 }}
                      >
                        {notificationCount}
                      </span>
                    </div>
                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                      {alerts.map((alert) => {
                        const s = alertStyle(alert.type);
                        return (
                          <div key={alert.id} className="px-4 py-3 flex items-start gap-3">
                            <AlertTriangle size={14} style={{ color: s.text, marginTop: "2px", flexShrink: 0 }} />
                            <p style={{ color: "var(--text-primary)", fontSize: "12px", lineHeight: 1.5 }}>{alert.text}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-4 py-2 border-t" style={{ borderColor: "var(--border)" }}>
                      <button
                        style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}
                        onClick={() => setNotifOpen(false)}
                      >
                        Ver todos os alertas →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "11px" }}
            >
              JS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto" style={{ backgroundColor: "var(--bg)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}