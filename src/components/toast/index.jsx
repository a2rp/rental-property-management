import { useEffect } from "react";
import { FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = { success: FiCheckCircle, error: FiXCircle, info: FiInfo };

const ToastItem = ({ item, onDismiss }) => {
  useEffect(() => {
    const timeout = window.setTimeout(() => onDismiss(item.id), 5000);
    return () => window.clearTimeout(timeout);
  }, [item.id, onDismiss]);
  const Icon = icons[item.type] || FiInfo;
  return <div className={`${styles.toast} ${styles[item.type] || ""}`} role={item.type === "error" ? "alert" : "status"}>
    <Icon aria-hidden="true" /><p>{item.message}</p><button type="button" aria-label="Dismiss notification" onClick={() => onDismiss(item.id)}><FiX aria-hidden="true" /></button>
  </div>;
};

const Toast = ({ items, onDismiss }) => <div className={styles.stack} aria-label="Notifications">{items.map((item) => <ToastItem key={item.id} item={item} onDismiss={onDismiss} />)}</div>;

export default Toast;
