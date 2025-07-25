export const convertToBRL = (value: string | number): string => {
    const num = parseFloat(String(value).replace(',','.'))

    if (isNaN(num)) return String(value)

    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    })
}