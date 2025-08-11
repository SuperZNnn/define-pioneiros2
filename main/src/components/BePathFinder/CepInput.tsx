import { useRef, useState } from "react"

const CepInput = ({send}: {send?: (cep: string) => void}) => {
    const [cep, setCep] = useState<string>("")

    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "")
        if (value.length > 5) {
            value = value.replace(/(\d{5})(\d)/, "$1-$2")
        }
        if (value.length === 9){
            inputRef.current?.blur()
        }

        setCep(value)
        if (send) {
            send(value)
            if (value.length === 9) inputRef.current?.blur()
        }
    }

    return (
        <input
            ref={inputRef}
            className="ipt-basic border"
            placeholder="Digite seu CEP"
            inputMode="numeric"
            type="text"
            maxLength={9}
            value={cep}
            onChange={handleChange}
        />
    )
}
export default CepInput