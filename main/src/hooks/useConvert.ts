export const formatCPF = (cpf: string): string => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}
export const formatPhoneNumber = (phone:string) => {
    const cleaned = phone.replace(/\D/g, '')
    
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
}

export const formatDate = (date: Date | string | undefined, withTime?: boolean) => {
    if (!date) return "N/A";

    const parsedDate = date instanceof Date ? new Date(date) : new Date(date);

    if (isNaN(parsedDate.getTime())) return "Data inválida";

    const day = String(parsedDate.getUTCDate()).padStart(2, '0');
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
    const year = parsedDate.getUTCFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    if (withTime) {
        const hours = String(parsedDate.getUTCHours()).padStart(2, '0');
        const minutes = String(parsedDate.getUTCMinutes()).padStart(2, '0');
        return `${formattedDate} ${hours}:${minutes}`;
    }

    return formattedDate;
}
export const formatDateBr = (date: Date | string | undefined, withTime?: boolean) => {
    if (!date) return "N/A";

    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate.getTime())) return "Data inválida";

    const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        ...(withTime && {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        })
    };

    return new Intl.DateTimeFormat("pt-BR", options).format(parsedDate);
}

export const formatInputCPF = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  const part1 = digits.slice(0, 3)
  const part2 = digits.slice(3, 6)
  const part3 = digits.slice(6, 9)
  const part4 = digits.slice(9, 11)
  if (digits.length >= 10) return `${part1}.${part2}.${part3}-${part4}`
  else if (digits.length >= 7) return `${part1}.${part2}.${part3}`
  else if (digits.length >= 4) return `${part1}.${part2}`
  else return part1
}
export const formatInputPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  const ddd = digits.slice(0, 2)
  const prefix = digits.slice(2, 7)
  const suffix = digits.slice(7, 11)
  if (digits.length >= 7) return `(${ddd}) ${prefix}-${suffix}`
  else if (digits.length >= 3) return `(${ddd}) ${prefix}`
  else if (digits.length >= 1) return `(${ddd}`
  else return ''
}

export const PhoneStringToNumber = (phone: string) => {
    if (phone.length===0) return ''

    const onlyNumbers = phone.replace(/\D/g, "")

    const ddd = onlyNumbers.slice(0,2)
    const noNine = onlyNumbers.slice(3)

    return `55${ddd}${noNine}`
}

export const convertToBRL = (value: string | number): string => {
    const num = parseFloat(String(value).replace(',','.'))

    if (isNaN(num)) return String(value)

    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    })
}
export const formatCentavos = (centavos: number) => {
    return (centavos/100).toFixed(2).replace(".",",")
}