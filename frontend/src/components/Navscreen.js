import styles from "../styles/Navscreen.module.scss";
import { ImCross } from "react-icons/im";
import Backdrop from "./Backdrop";
import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";
export default function Navscreen({ handleClose, links = [] }) {
  const {user, isAdmin} = useUser();
  return (
    <Backdrop className={`d-lg-none`}>
      <ImCross
        onClick={handleClose}
        className={`fs-1  text-white ${styles.close}`}
      />
      <ul className={styles.container}>
        {links
           .filter(link=>{
            if(link.guest && user) return false;
            if(link.admin && !isAdmin) return false;
            if(link.guide && (!user || user.role!=="GUIDE")) return false;
            return true;
          })
          .map((link) => (
            <li key={link.label} className="mx-1 text-decoration-none">
              <Link onClick={handleClose} to={link.path}>
                {link.label}
              </Link>
            </li>
          ))}
      </ul>
    </Backdrop>
  );
}
