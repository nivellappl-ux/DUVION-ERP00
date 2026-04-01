# KwanzaERP - Sistema de Gestão Empresarial para Angola

Complete ERP web application designed specifically for Angolan businesses with a premium gold/champagne corporate design.

## Features

### Screens Implemented

1. **Login Page** (`/`)
   - Clean centered card design
   - Gold focus states on inputs
   - Angola flag color accent bar
   - Corporate tagline: "Gestão empresarial feita para Angola"

2. **Main Dashboard** (`/dashboard`)
   - Real-time KPI cards: Revenue, Invoices, Cash Balance, Active Employees
   - Revenue line chart with 6-month trend
   - Recent transactions table with status badges
   - Left sidebar navigation with gold accent active states
   - Top navigation bar with notifications and user avatar

3. **Invoice/Faturação** (`/dashboard/faturacao`)
   - AGT-compliant invoice series (FT 2025/XXX)
   - Dynamic line items table with IVA 14% calculation
   - Dual currency display (AOA and USD)
   - Client selector and date pickers
   - Real-time subtotal, IVA, and total calculations
   - Status badge system (Paga, Pendente, Vencida)

4. **HR Module** (`/dashboard/rh`)
   - Employee list with department filters
   - Search functionality
   - Payroll summary cards (Total, INSS, IRT)
   - Side panel with detailed employee profile
   - INSS and IRT bracket information
   - Salary breakdown with deductions

5. **Treasury/Tesouraria** (`/dashboard/tesouraria`)
   - Dual currency balance display (AOA primary, USD secondary)
   - BNA official vs market exchange rate widget
   - Cash flow bar chart (6-month inflows vs outflows)
   - Bank accounts panel (BAI, BFA, BIC)
   - Pending payments list with urgency indicators

6. **Mobile Version** (`/mobile`)
   - Bottom navigation bar (390px width)
   - Vertical KPI cards optimized for touch
   - Quick action buttons: Emitir Fatura, Ver Estoque, Registar Pagamento
   - Offline mode indicator banner
   - Recent activity feed
   - Touch-friendly interface

7. **Style Guide** (`/style-guide`)
   - Complete color palette showcase
   - Typography scale (Space Grotesk)
   - Button states (Primary, Secondary, Ghost, Disabled)
   - Input field variations
   - Status badge variants
   - Card and surface examples
   - Icon samples from Lucide
   - 8pt grid spacing system
   - Table style demonstration

## Design System

### Colors
- **Primary Gold**: #C9A84C
- **Deep Gold**: #A67C00
- **Light Gold**: #F0D080
- **Dark Background**: #0F0F0F
- **Surface Cards**: #1A1A1A
- **Warm Gray**: #2A2422
- **White Text**: #F5F5F5
- **Gray Text**: #9A9A9A

### Typography
- **Font Family**: Space Grotesk
- **Weights**: Regular (400), Medium (500), Bold (700)
- **Headings**: Bold 700
- **Body**: Regular 400
- **Data/Numbers**: Medium 500

### Border Radius
- **Cards**: 8px
- **Inputs**: 6px
- **Badges**: 4px

### Spacing
8pt grid system throughout: 8px, 16px, 24px, 32px, 40px, 48px

## Navigation

Start at the login page (`/`) and click "Entrar" to access the dashboard. Use the left sidebar to navigate between modules:
- Dashboard
- Faturação (Invoices)
- Tesouraria (Treasury)
- RH (Human Resources)

Access the mobile version directly at `/mobile` and the style guide at `/style-guide`.

## Mock Data

The application uses realistic mock data representing typical Angolan businesses:
- Companies: Sonangol, Unitel, BAI, Angola Telecom, TAAG
- Currency: Angolan Kwanza (AOA) and USD
- Exchange rates: BNA official and market rates
- IVA: 14% (Angola standard rate)
- Social contributions: INSS, IRT calculations

## Design Philosophy

**Bloomberg Terminal meets Modern SaaS**
- Serious, data-dense but breathable
- Premium corporate feel
- No gradients (except subtle on cards)
- Flat design with selective gold accents
- Minimal but informative
- Touch-friendly on mobile
