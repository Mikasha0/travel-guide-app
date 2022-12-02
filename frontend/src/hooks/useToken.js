import { useEffect, useState } from "react"
import {useSelector,useDispatch} from 'react-redux'
import {setToken as saveToken, setUser, deleteToken} from '../redux/authSlice'

export default function useToken() {

 const [token, setToken] = useState(useSelector(state=>state.auth.token))
 const dispatch = useDispatch()


 useEffect(()=>{
    if(!token){
        dispatch(deleteToken())
    }else{
        dispatch(saveToken(token))
    }
 }, [token])
 
 return [token, setToken]
}
