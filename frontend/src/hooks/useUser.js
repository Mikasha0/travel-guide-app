import useToken from './useToken'
import {setUser, setAuthenticating, setAdmin} from '../redux/authSlice'
import { useEffect } from 'react'
import { doGet } from '../utils/request'
import { useSelector, useDispatch } from 'react-redux'

export default function useUser() {
  const [token] = useToken() 
  const user = useSelector(state=> state.auth.user)
  const isAdmin = useSelector(state=> state.auth.isAdmin)
  const isAuthenticating = useSelector(state=> state.auth.isAuthenticating)
 const dispatch = useDispatch();

 const fetchUser = async ()=>{
    try{
        setAuthenticating(true)
        const response = await doGet({
            path: 'auth/user',
            token: token
        })
        if(!response.ok) return;
        const body = await response.json()
        dispatch(setUser(body.data))
        dispatch(setAdmin(body.data.role==="ADMIN"))
        
    }catch(err){
        console.log(err)
    }finally{
        setAuthenticating(false)
    }
 }


  useEffect(()=>{
    if(token){
        fetchUser()
    }
  },[token])

  return {
      isAdmin,
      isAuthenticating,
      user
  }
}
