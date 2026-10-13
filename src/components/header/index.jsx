import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiBell, FiFileText, FiGithub, FiGrid, FiHome, FiMenu, FiPlus, FiTool, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const links = [
  ["/overview", "Overview", FiGrid],
  ["/properties", "Properties", FiHome],
  ["/leases", "Leases", FiFileText],
  ["/maintenance", "Maintenance", FiTool],
];

const Header = ({ unreadCount = 0, onOpenNotifications }) => {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (menuOpen || currentY < 24) setHidden(false);
      else if (currentY > previousY + 5) setHidden(true);
      else if (currentY < previousY - 5) setHidden(false);
      previousY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.topRow}>
        <button className={styles.brand} type="button" onClick={() => navigate("/overview")} aria-label="Hearthline overview">
          <span className={styles.mark}><FiHome aria-hidden="true" /></span>
          <span><strong>hearthline</strong><small>PROPERTY DESK</small></span>
        </button>

        <nav className={styles.navigation} aria-label="Main navigation">
          {links.map(([to, label, Icon]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>
            <Icon aria-hidden="true" /><span>{label}</span>
          </NavLink>)}
        </nav>

        <div className={styles.actions}>
          <a className={styles.repository} href="https://github.com/a2rp/rental-property-management" target="_blank" rel="noreferrer" aria-label="Repository on GitHub"><FiGithub aria-hidden="true" /><span>Repository</span></a>
          <button className={styles.notification} type="button" onClick={onOpenNotifications} aria-label={`Notifications${unreadCount ? `, ${unreadCount} new` : ""}`}>
            <FiBell aria-hidden="true" />{unreadCount > 0 && <span>{unreadCount}</span>}
          </button>
          <button className={styles.addProperty} type="button" onClick={() => navigate("/properties?new=1")}><FiPlus aria-hidden="true" /><span>Add property</span></button>
          <span className={styles.avatar} aria-label="Morgan Lee, portfolio manager">ML</span>
          <button className={styles.menuToggle} type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}</button>
        </div>
      </div>
      {menuOpen && <nav className={styles.mobileNavigation} aria-label="Mobile navigation">
        {links.map(([to, label, Icon]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ""}`}>
          <Icon aria-hidden="true" /><span>{label}</span>
        </NavLink>)}
      </nav>}
    </header>
  );
};

export default Header;
