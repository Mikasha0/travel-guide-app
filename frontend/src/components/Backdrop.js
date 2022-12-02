import styles from '../styles/Backdrop.module.scss'
export default function Backdrop({
    children, 
    className
}) {
  return (
    <section className={`${styles.container} ${className}`}>
        {children}
    </section>
  )
}
