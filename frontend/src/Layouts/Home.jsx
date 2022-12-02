import {Outlet} from 'react-router-dom'
import Navbar from '../components/Navbar'
export default function Home() {
  return (
    <main>
        <Navbar />
        <Outlet />
    </main>
  )
}
