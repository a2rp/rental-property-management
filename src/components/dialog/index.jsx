import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Dialog = ({ title, description, children, onClose, size = "medium" }) => {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);

  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const panel = panelRef.current;
    const previous = document.activeElement;
    panel?.querySelector("[data-dialog-initial], input, select, textarea, button")?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab" && panel) {
        const items = [...panel.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]')];
        if (!items.length) return;
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
      }
    };
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, []);

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={panelRef} className={`${styles.dialog} ${styles[size] || ""}`} role="dialog" aria-modal="true" aria-labelledby="hearthline-dialog-title" aria-describedby={description ? "hearthline-dialog-description" : undefined}>
        <header className={styles.header}>
          <div><h2 id="hearthline-dialog-title">{title}</h2>{description && <p id="hearthline-dialog-description">{description}</p>}</div>
          <button className={styles.close} type="button" onClick={onClose} aria-label="Close dialog"><FiX aria-hidden="true" /></button>
        </header>
        <div className={styles.content}>{children}</div>
      </section>
    </div>
  );
};

export default Dialog;
