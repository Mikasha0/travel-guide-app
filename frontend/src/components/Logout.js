import { Button, notification } from 'antd'
import React from 'react'
import useToken from '../hooks/useToken'
import { doPost } from '../utils/request'

export default function Logout() {
 const [token, setToken] = useToken()
 const logout = async ()=>{
     try{
         const response = await doPost({path:"auth/logout",token:token})
         if(response.ok){
             notification.success({
                 message:"logged out"
             })
             return setToken('')
         }
         notification.error({
            message:"Failed"
        })
     }catch(err){
         console.log(err)
        notification.error({
            message:"Failed"
        })
     }
    }
 
  return (
    <Button
    type='link'
    onClick={logout}
    className='mx-2 text-danger'
    >Logout</Button>
  )
}
