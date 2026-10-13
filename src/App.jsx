import { FiHome, FiKey } from "react-icons/fi";
import styles from "./App.module.css";

const App = () => (
  <main className={styles.page}>
    <span className={styles.mark}><FiHome aria-hidden="true" /></span>
    <p>HEARTHLINE PROPERTY DESK</p>
    <h1>A steadier way to run your rentals.</h1>
    <span className={styles.caption}>Properties, leasing, rent, and upkeep in one clear workspace.</span>
    <span className={styles.status}><FiKey aria-hidden="true" /> Your property workspace is being prepared</span>
  </main>
);

export default App;
