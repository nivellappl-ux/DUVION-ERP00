export const TAXAS_IVA = { isento: 0, reduzida: 5, normal: 14 } as const

export const calcularLinhaFatura = (
    quantidade: number, precoUnit: number, taxaIVA: number, descontoPct = 0
) => {
    const bruto = quantidade * precoUnit
    const desconto = Math.round(bruto * (descontoPct / 100) * 100) / 100
    const subtotal = bruto - desconto
    const valorIVA = Math.round(subtotal * (taxaIVA / 100) * 100) / 100
    return { subtotal, desconto, valorIVA, total: subtotal + valorIVA }
}

export const calcularTotalFatura = (itens: Array<{
    quantidade: number; precoUnitario: number; taxaIVA: number; descontoPct?: number
}>) => {
    let subtotal = 0, totalDesconto = 0, totalIVA = 0
    const linhas = itens.map(i => {
        const l = calcularLinhaFatura(i.quantidade, i.precoUnitario, i.taxaIVA, i.descontoPct)
        subtotal += l.subtotal; totalDesconto += l.desconto; totalIVA += l.valorIVA
        return l
    })
    return { linhas, subtotal, totalDesconto, totalIVA, total: subtotal + totalIVA }
}
