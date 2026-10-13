import { FaCodepen, FaCoffee, FaEnvelope, FaFacebookF, FaGithub, FaGlobe, FaHandHoldingHeart, FaLinkedinIn, FaPatreon, FaYoutube } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import styles from "./styles.module.css";

const links = [
  ["Portfolio", "ashishranjan.net", "https://www.ashishranjan.net", FaGlobe],
  ["GitHub", "github.com/a2rp", "https://github.com/a2rp", FaGithub],
  ["CodePen", "codepen.io/ash1198", "https://codepen.io/ash1198", FaCodepen],
  ["LinkedIn", "linkedin.com/in/aashishranjan", "https://www.linkedin.com/in/aashishranjan", FaLinkedinIn],
  ["Facebook", "facebook.com/theash.ashish", "https://www.facebook.com/theash.ashish/", FaFacebookF],
  ["YouTube", "youtube.com/@ashishranjan-ashz", "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", FaYoutube],
  ["Email", "ash.ranjan09@gmail.com", "mailto:ash.ranjan09@gmail.com", FaEnvelope],
  ["Support", "a2rp-donation-page.netlify.app", "https://a2rp-donation-page.netlify.app/", FaHandHoldingHeart],
  ["Buy Me a Coffee", "buymeacoffee.com/a2rp", "https://www.buymeacoffee.com/a2rp", FaCoffee],
  ["Patreon", "patreon.com/ashishranjan", "https://www.patreon.com/ashishranjan", FaPatreon],
  ["Source code", "github.com/a2rp/rental-property-management", "https://github.com/a2rp/rental-property-management", FaGithub],
];

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.identity}>
      <a className={styles.logo} href="https://www.ashishranjan.net" target="_blank" rel="noreferrer" aria-label="Ashish Ranjan portfolio"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="" /></a>
      <div><strong>Hearthline Property Desk</strong><p>Copyright {new Date().getFullYear()} <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p></div>
    </div>
    <nav className={styles.links} aria-label="Creator and project links">
      {links.map(([label, detail, href, Icon]) => <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noreferrer"} aria-label={label} data-tooltip-id="hearthline-footer-tooltip" data-tooltip-content={`${label}\n${detail}`}><Icon aria-hidden="true" /></a>)}
    </nav>
    <Tooltip id="hearthline-footer-tooltip" place="top" className={styles.tooltip} />
  </footer>
);

export default Footer;
