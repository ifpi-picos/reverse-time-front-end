import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function PrivateRoute({url, children}) {
    const [redirecting, setRedirecting] = useState(false)
    
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        
        if (!token) {
            return router.replace("/")
        }

        axios
            .get(url, {headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": token
            }})
            .then((res) => {
                if (res.status === 401) {
                    localStorage.clear()
                    return router.replace("/")
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    localStorage.clear()
                    return router.replace("/")
                }
            })

        return setRedirecting(true)
        
    }, [])

    if (!redirecting) {
        return null
    }
        
    return children
}
