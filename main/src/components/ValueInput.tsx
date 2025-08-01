import { useState, type ReactElement } from "react"

const ValueInput = ({ onValueChange, resetError }: { onValueChange: (rawCents: number) => void, resetError?: () => void }): ReactElement => {
    const [value, setValue] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value.replace(/\D/g, '')
        if (!raw) raw = '0'

        const number = parseInt(raw, 10)
        const formatted = (number / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        setValue(formatted)
        onValueChange(number)
        if (resetError) resetError()
    }

    return (
        <input
            className="ipt-basic"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            placeholder="R$ 0,00"
            style={{
                width: '100%',
                height: '10vh',
                fontSize: '2rem',
                fontWeight: 'bolder',
                textAlign: 'center',
                border: '.3vh solid var(--fifth-color)'
            }}
        />
    )
}
export default ValueInput
