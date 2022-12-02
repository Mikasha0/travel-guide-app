import { Skeleton } from "antd"
import { Navigate } from "react-router-dom"
import useToken from "../../hooks/useToken"
import useUser from "../../hooks/useUser"


export default function Guest({element}) {
    const [token] = useToken()
    const {user, isAuthenticating} = useUser()
   
    
    if(!token) return element;
    if(isAuthenticating) return <Skeleton />
    if(user) return <Navigate to={'/'} replace={true} />
    return element;
}
