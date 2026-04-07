import { calcularINSS } from './inss';

const ESCALOES = [
    { min: 0, max: 100000, taxa: 0, parcela: 0 },
    { min: 100001, max: 150000, taxa: 0.10, parcela: 10000 },
    { min: 150001, max: 200000, taxa: 0.13, parcela: 14500 },
    { min: 200001, max: 300000, taxa: 0.16, parcela: 20500 },
    { min: 300001, max: 500000, taxa: 0.18, parcela: 26500 },
    { min: 500001, max: 1000000, taxa: 0.19, parcela: 31500 },
    { min: 1000001, max: 1500000, taxa: 0.20, parcela: 41500 },
    { min: 1500001, max: 2000000, taxa: 0.21, parcela: 56500 },
    { min: 2000001, max: Infinity, taxa: 0.25, parcela: 136500 },
]

export const calcularIRT = (rendimento: number): number => {
    const e = ESCALOES.find(e => rendimento >= e.min && rendimento <= e.max)
    if (!e || e.taxa === 0) return 0
    return Math.max(0, Math.round((rendimento * e.taxa - e.parcela) * 100) / 100)
}

export const calcularSalarioCompleto = (params: {
    salarioBase: number
    subsidioAlimentacao?: number
    subsidioTransporte?: number
    outrosSubsidios?: number
    horasExtraValor?: number
    faltasDesconto?: number
    outrosDescontos?: number
}) => {
    const bruto = params.salarioBase + (params.subsidioAlimentacao ?? 0)
        + (params.subsidioTransporte ?? 0) + (params.outrosSubsidios ?? 0)
        + (params.horasExtraValor ?? 0)
    const { trabalhador: inss, patronal: inssPatronal } = calcularINSS(params.salarioBase)
    const rendimentoIRT = bruto - inss
    const irt = calcularIRT(rendimentoIRT)
    const totalDescontos = inss + irt + (params.faltasDesconto ?? 0) + (params.outrosDescontos ?? 0)
    return {
        salarioBruto: bruto, inss, inssPatronal, irt,
        rendimentoColectavel: rendimentoIRT,
        totalDescontos, salarioLiquido: bruto - totalDescontos
    }
}
