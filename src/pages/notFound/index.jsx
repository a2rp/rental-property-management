import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import styles from "./styles.module.css";

const NotFound = () => (
  <section className={styles.page}>
    <span className={styles.icon}><FiHome aria-hidden="true" /></span>
    <p className={styles.eyebrow}>HEARTHLINE PROPERTY DESK</p>
    <h2>That address isn't on the portfolio.</h2>
    <p className={styles.copy}>The page may have moved. Return to your portfolio overview to pick up where you left off.</p>
    <Link to="/overview"><FiArrowLeft aria-hidden="true" /> Back to overview</Link>
  </section>
);

export default NotFound;