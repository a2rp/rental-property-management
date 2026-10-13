import { FiAlertTriangle } from "react-icons/fi";
import Dialog from "../dialog";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, message, confirmLabel = "Confirm", onConfirm, onCancel, tone = "danger" }) => (
  <Dialog title={title} description={message} onClose={onCancel} size="small">
    <div className={styles.note}><FiAlertTriangle aria-hidden="true" /><p>This change cannot be undone.</p></div>
    <div className={styles.actions}>
      <button className={styles.cancel} type="button" data-dialog-initial onClick={onCancel}>Keep it</button>
      <button className={`${styles.confirm} ${tone === "danger" ? styles.danger : styles.normal}`} type="button" onClick={onConfirm}>{confirmLabel}</button>
    </div>
  </Dialog>
);

export default ConfirmDialog;
