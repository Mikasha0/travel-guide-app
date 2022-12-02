
import styles from "../../../styles/Hero.module.scss";
import PlaceSearch from "../../PlaceSearch";

export default function Hero() {
  return (
    <section className={styles.container}>
      <h1 className="text-white bg-dark px-2">Find Your Destination</h1>
      <PlaceSearch />
    </section>
  );
}
