import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {GiHamburgerMenu} from 'react-icons/gi'
import styles from '../styles/Nav.module.scss'
import Navscreen from './Navscreen'
import useUser from '../hooks/useUser'
import {FaLessThan} from 'react-icons/fa'
import Logout from './Logout'

const links = [
  {
    label: "Home",
    path: '/'
  },
  {
    label: "Places",
    path: '/places'
  },
  {
    label: "Cities",
    path: '/cities'
  },
  {
    label: "Login",
    path: '/login',
    guest: true
  },
  {
    label: "Admin",
    path: '/admin',
    admin: true
  },
  {
    label: "Bookings",
    path: '/guide/bookings',
    guide: true
  },
  {
    label: "My Bookings",
    path: '/my-bookings'
  },
]

export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const open = ()=>setVisible(true)
  const close = ()=>setVisible(false)
  const {user, isAdmin} = useUser()
  const navigate = useNavigate()
  

  
  return (
    <header className={styles.container}>
       <FaLessThan onClick={()=>navigate(-1)} className='fs-2 text-white'/>
        <div className={`${styles.navlinks}  ms-auto d-none d-lg-flex me-4`}>
          { 
          links.filter(link=>{
            if(link.guest && user) return false;
            if(link.admin && !isAdmin) return false;
            if(link.guide && (!user || user.role!=="GUIDE")) return false;
            return true;
          })
          .map(link=>(
            
                <Link className='mx-2' key={link.label} to={link.path}>{link.label}</Link>
           
          )) 
          }
          {user && <Logout />}
        </div>
        <GiHamburgerMenu onClick={open}  className='fs-1 ms-auto me-4 text-white d-lg-none'/>
       {visible &&  <Navscreen links={links} handleClose={close}/>}
    </header>
  )
}
