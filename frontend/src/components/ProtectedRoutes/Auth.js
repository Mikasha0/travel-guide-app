import { Skeleton } from "antd"
import { Navigate } from "react-router-dom"
import useUser from "../../hooks/useUser"


export default function Auth({element}) {
    const {user, isAuthenticating} = useUser()
    if(isAuthenticating) return <Skeleton/>
    if(!user) return <Navigate to={'/login'} replace={true} />
    return element;
}
