import { Skeleton } from "antd"
import { Navigate } from "react-router-dom"
import useUser from "../../hooks/useUser"



export default function Admin({element}) {
    const {user, isAdmin, isAuthenticating} = useUser()
    if(isAuthenticating) return <Skeleton />
    if(!user) return <Navigate to={'/login'} replace={true} />
    if(isAdmin==false) return <Navigate to={'/'} replace={true} />
    return element;
}
