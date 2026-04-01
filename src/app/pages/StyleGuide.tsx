import { Check, X, AlertCircle, FileText, Users, Wallet } from "lucide-react";

export default function StyleGuide() {
  return (
    <div 
      className="min-h-screen p-8"
      style={{ backgroundColor: '#0F0F0F' }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-3" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Duvion
          </h1>
          <p style={{ color: '#9A9A9A' }}>
            Sistema de Gestão Empresarial para Angola
          </p>
        </div>

        {/* Color Palette */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#F5F5F5', fontWeight: 700 }}>
            Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Primary Blue", color: "#2563EB", text: "#ffffff" },
              { name: "Deep Blue", color: "#1D4ED8", text: "#ffffff" },
              { name: "Light Blue", color: "#60A5FA", text: "#0F1729" },
              { name: "Dark Background", color: "#0C1626", text: "#EEF2FF" },
              { name: "Surface Cards", color: "#121F36", text: "#EEF2FF" },
              { name: "Blue Border", color: "#1E3354", text: "#EEF2FF" },
              { name: "Text Primary", color: "#EEF2FF", text: "#0C1626" },
              { name: "Text Secondary", color: "#7B95BB", text: "#0C1626" },
            ].map((item) => (
              <div key={item.name}>
                <div 
                  className="h-24 rounded-lg mb-2 flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <span style={{ color: item.text, fontWeight: 500 }}>
                    {item.color}
                  </span>
                </div>
                <p className="text-sm text-center" style={{ color: '#9A9A9A' }}>
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#F5F5F5', fontWeight: 700 }}>
            Typography - Space Grotesk
          </h2>
          <div 
            className="p-6 rounded-lg space-y-4"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <div>
              <p className="text-sm mb-2" style={{ color: '#9A9A9A' }}>
                Heading Bold 700 - 32px
              </p>
              <h1 className="text-4xl" style={{ color: '#F5F5F5', fontWeight: 700 }}>
                The quick brown fox jumps
              </h1>
            </div>
            <div>
              <p className="text-sm mb-2" style={{ color: '#9A9A9A' }}>
                Heading Bold 700 - 24px
              </p>
              <h2 className="text-2xl" style={{ color: '#F5F5F5', fontWeight: 700 }}>
                The quick brown fox jumps over the lazy dog
              </h2>
            </div>
            <div>
              <p className="text-sm mb-2" style={{ color: '#9A9A9A' }}>
                Body Medium 500 - 16px
              </p>
              <p style={{ color: '#F5F5F5', fontWeight: 500 }}>
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </div>
            <div>
              <p className="text-sm mb-2" style={{ color: '#9A9A9A' }}>
                Body Regular 400 - 16px
              </p>
              <p style={{ color: '#F5F5F5', fontWeight: 400 }}>
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </div>
            <div>
              <p className="text-sm mb-2" style={{ color: '#9A9A9A' }}>
                Small Regular 400 - 14px
              </p>
              <p className="text-sm" style={{ color: '#9A9A9A', fontWeight: 400 }}>
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#F5F5F5', fontWeight: 700 }}>
            Buttons
          </h2>
          <div 
            className="p-6 rounded-lg space-y-4"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <div className="flex flex-wrap gap-4">
              <button
                className="px-6 py-3 rounded-md flex items-center gap-2"
                style={{
                  backgroundColor: '#2563EB',
                  color: '#ffffff',
                  fontWeight: 500,
                }}
              >
                <Check size={20} />
                Primary Button
              </button>
              <button
                className="px-6 py-3 rounded-md flex items-center gap-2 border"
                style={{
                  borderColor: '#2563EB',
                  color: '#2563EB',
                  fontWeight: 500,
                  backgroundColor: 'transparent',
                }}
              >
                <FileText size={20} />
                Secondary Button
              </button>
              <button
                className="px-6 py-3 flex items-center gap-2"
                style={{
                  color: '#2563EB',
                  fontWeight: 500,
                }}
              >
                <Users size={20} />
                Ghost Button
              </button>
            </div>

            <div>
              <p className="text-sm mb-3" style={{ color: '#9A9A9A' }}>
                Disabled State
              </p>
              <button
                className="px-6 py-3 rounded-md"
                style={{
                  backgroundColor: '#2A2422',
                  color: '#9A9A9A',
                  fontWeight: 500,
                  cursor: 'not-allowed',
                }}
                disabled
              >
                Disabled Button
              </button>
            </div>
          </div>
        </section>

        {/* Input Fields */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#F5F5F5', fontWeight: 700 }}>
            Input Fields
          </h2>
          <div 
            className="p-6 rounded-lg space-y-4"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <div>
              <label className="block mb-2 text-sm" style={{ color: '#F5F5F5', fontWeight: 500 }}>
                Default Input
              </label>
              <input
                type="text"
                placeholder="Placeholder text"
                className="w-full px-4 py-3 rounded-md border"
                style={{
                  backgroundColor: '#0F0F0F',
                  borderColor: '#2A2422',
                  color: '#F5F5F5',
                }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm" style={{ color: '#F5F5F5', fontWeight: 500 }}>
                Focus State (Gold Border)
              </label>
              <input
                type="text"
                placeholder="Click to see focus state"
                className="w-full px-4 py-3 rounded-md border focus:outline-none"
                style={{
                  backgroundColor: '#0F0F0F',
                  borderColor: '#C9A84C',
                  color: '#F5F5F5',
                }}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm" style={{ color: '#F5F5F5', fontWeight: 500 }}>
                Select Dropdown
              </label>
              <select
                className="w-full px-4 py-3 rounded-md border"
                style={{
                  backgroundColor: '#0F0F0F',
                  borderColor: '#2A2422',
                  color: '#F5F5F5',
                }}
              >
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#F5F5F5', fontWeight: 700 }}>
            Status Badges
          </h2>
          <div 
            className="p-6 rounded-lg"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <div className="flex flex-wrap gap-3">
              <span 
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: '#10B98120', 
                  color: '#10B981',
                  fontWeight: 500
                }}
              >
                <Check size={14} />
                Paga
              </span>
              
              <span 
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: 'rgba(245,158,11,0.12)', 
                  color: '#F59E0B',
                  fontWeight: 500
                }}
              >
                <AlertCircle size={14} />
                Pendente
              </span>
              
              <span 
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: '#EF444420', 
                  color: '#EF4444',
                  fontWeight: 500
                }}
              >
                <X size={14} />
                Vencida
              </span>

              <span 
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: '#6B728020', 
                  color: '#6B7280',
                  fontWeight: 500
                }}
              >
                Regular
              </span>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#F5F5F5', fontWeight: 700 }}>
            Cards & Surfaces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              <h3 className="mb-2" style={{ color: '#F5F5F5', fontWeight: 700 }}>
                Standard Card
              </h3>
              <p style={{ color: '#9A9A9A', fontSize: '14px' }}>
                8px border radius
                <br />
                Background: #1A1A1A
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border-2"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--primary)' }}
            >
              <h3 className="mb-2" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Highlighted Card
              </h3>
              <p style={{ color: '#9A9A9A', fontSize: '14px' }}>
                With blue border accent
                <br />
                Border: 2px var(--primary)
              </p>
            </div>

            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: '#2A2422' }}
            >
              <h3 className="mb-2" style={{ color: '#F5F5F5', fontWeight: 700 }}>
                Secondary Surface
              </h3>
              <p style={{ color: '#9A9A9A', fontSize: '14px' }}>
                Warm gray background
                <br />
                Background: #2A2422
              </p>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#F5F5F5', fontWeight: 700 }}>
            Icons - Lucide React
          </h2>
          <div 
            className="p-6 rounded-lg"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col items-center gap-2">
                <FileText size={32} style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: '#9A9A9A' }}>FileText</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Users size={32} style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: '#9A9A9A' }}>Users</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Wallet size={32} style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: '#9A9A9A' }}>Wallet</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Check size={32} style={{ color: '#10B981' }} />
                <span className="text-sm" style={{ color: '#9A9A9A' }}>Check</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <X size={32} style={{ color: '#EF4444' }} />
                <span className="text-sm" style={{ color: '#9A9A9A' }}>X</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AlertCircle size={32} style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: '#9A9A9A' }}>AlertCircle</span>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing System */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#F5F5F5', fontWeight: 700 }}>
            Spacing - 8pt Grid System
          </h2>
          <div 
            className="p-6 rounded-lg space-y-3"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            {[8, 16, 24, 32, 40, 48].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <div 
                  className="h-8"
                  style={{ 
                    width: `${size}px`,
                    backgroundColor: '#2563EB',
                  }}
                />
                <span style={{ color: '#F5F5F5', fontWeight: 500 }}>
                  {size}px
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Table Example */}
        <section>
          <h2 className="text-2xl mb-6" style={{ color: '#F5F5F5', fontWeight: 700 }}>
            Table Style
          </h2>
          <div 
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--primary)' }}>
                  <th className="text-left p-4" style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '14px' }}>
                    Column 1
                  </th>
                  <th className="text-left p-4" style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '14px' }}>
                    Column 2
                  </th>
                  <th className="text-right p-4" style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '14px' }}>
                    Column 3
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#1A1A1A' }}>
                  <td className="p-4" style={{ color: '#F5F5F5', fontWeight: 500 }}>
                    Row 1 Data
                  </td>
                  <td className="p-4" style={{ color: '#F5F5F5' }}>
                    Value 1
                  </td>
                  <td className="p-4 text-right" style={{ color: '#F5F5F5', fontWeight: 500 }}>
                    100
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#141414' }}>
                  <td className="p-4" style={{ color: '#F5F5F5', fontWeight: 500 }}>
                    Row 2 Data
                  </td>
                  <td className="p-4" style={{ color: '#F5F5F5' }}>
                    Value 2
                  </td>
                  <td className="p-4 text-right" style={{ color: '#F5F5F5', fontWeight: 500 }}>
                    200
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}