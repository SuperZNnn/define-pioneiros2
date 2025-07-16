import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ApiRequests } from "../services/api"

const RedirectPage = () => {
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const redirectUrl = searchParams.get('for')

    useEffect(() => {
        if (redirectUrl){
            ApiRequests.verifyUrl(redirectUrl)
            .then(res=>{
                if (res.status === 200){
                    navigate('/', { state: { redirectUrl } })
                }
            })
            .catch(() => {
                window.location.href = 'http://localhost:5173'
            })
        }
        else{
            window.location.href = 'http://localhost:5173'
        }
    }, [])

    return (
        <pre>Carregando...</pre>
    )
}
export default RedirectPage