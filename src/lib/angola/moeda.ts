export const formatAOA = (v: number) =>
    new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 }).format(v)

export const formatNumero = (v: number, d = 2) =>
    new Intl.NumberFormat('pt-AO', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v)

export const parseValor = (s: string) =>
    parseFloat(s.replace(/[^\d,]/g, '').replace(',', '.')) || 0
