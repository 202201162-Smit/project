import { useEffect } from "react";
import { Navigate, replace } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider"

export const Logout = () => {
    const {Logout} = useAuth()
    useEffect(() => {
        Logout()
    }, [Logout])
    return <Navigate to={'/'} replace={true}/>
}