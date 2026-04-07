export const INSS = { TRABALHADOR: 0.03, PATRONAL: 0.08, TECTO: 750000 }

export const calcularINSS = (salarioBase: number) => {
    const base = Math.min(salarioBase, INSS.TECTO)
    return {
        trabalhador: Math.round(base * INSS.TRABALHADOR * 100) / 100,
        patronal: Math.round(base * INSS.PATRONAL * 100) / 100,
        base
    }
}
