import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
const duvionLogo = "/logo.png";
const blueBackground = "/bg.png";

export default function LoginPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{
        backgroundColor: "#1E3A8A",
        backgroundImage: `url(${blueBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-blue-950/50" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo - Outside the card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center">
            <img
              src={duvionLogo}
              alt="Duvion Logo"
              className="w-28 h-28"
              style={{ filter: "drop-shadow(0 8px 32px rgba(37,99,235,0.5))" }}
            />
          </div>
        </div>

        {/* Login Card */}
        <div
          className="p-8 rounded-xl backdrop-blur-md"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", border: "1px solid rgba(255, 255, 255, 0.3)", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)" }}
        >
          {/* Title inside card */}
          <div className="text-center mb-6">
            <h1 className="text-4xl mb-2" style={{ color: "var(--primary)", fontWeight: 700 }}>
              Duvion
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Sistema de Gestão Empresarial
            </p>
          </div>

          <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "18px", marginBottom: "24px" }}>
            Iniciar Sessão
          </p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm"
                style={{ color: "var(--text-primary)", fontWeight: 500 }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm"
                style={{ color: "var(--text-primary)", fontWeight: 500 }}
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none"
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" style={{ accentColor: "var(--primary)" }} />
                <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Lembrar-me</span>
              </label>
              <button type="button" style={{ color: "var(--primary)", fontSize: "13px", fontWeight: 500 }}>
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: "var(--primary)",
                color: "#fff",
                fontWeight: 600,
                boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
              }}
            >
              <LogIn size={18} />
              Entrar no Sistema
            </button>
          </form>
        </div>

        {/* Demo note */}
        <p className="text-center mt-4" style={{ color: "var(--text-muted)", fontSize: "12px" }}>
          Demo: qualquer email e senha funcionam
        </p>

        {/* Angola Flag Accent Bar */}
        <div className="mt-6 h-1 rounded-full flex overflow-hidden">
          <div className="flex-1" style={{ backgroundColor: "#CC0000" }} />
          <div className="flex-1" style={{ backgroundColor: "#000000" }} />
          <div className="flex-1" style={{ backgroundColor: "#FFD700" }} />
        </div>
      </div>
    </div>
  );
}