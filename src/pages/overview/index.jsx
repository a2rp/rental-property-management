import { Link } from "react-router-dom";
import { FiAlertCircle, FiArrowRight, FiCalendar, FiCheck, FiChevronRight, FiDollarSign, FiHome, FiMapPin, FiTool, FiTrendingUp } from "react-icons/fi";
import styles from "./styles.module.css";

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const shortDate = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));

const Overview = ({ properties, leases, requests, onMarkPaid }) => {
  const activeLeases = leases.filter((lease) => lease.status === "Active");
  const unitCount = properties.reduce((sum, property) => sum + property.units, 0);
  const occupiedCount = properties.reduce((sum, property) => sum + property.occupied, 0);
  const occupancy = unitCount ? Math.round(occupiedCount / unitCount * 100) : 0;
  const monthlyRent = activeLeases.reduce((sum, lease) => sum + lease.rent, 0);
  const collected = activeLeases.filter((lease) => lease.rentStatus === "Paid").reduce((sum, lease) => sum + lease.rent, 0);
  const collectionRate = monthlyRent ? Math.round(collected / monthlyRent * 100) : 0;
  const openRequests = requests.filter((request) => request.status !== "Completed");
  const urgentCount = openRequests.filter((request) => request.priority === "Urgent").length;
  const rentFollowUp = activeLeases.filter((lease) => lease.rentStatus !== "Paid").slice(0, 3);
  const leaseEndings = activeLeases.filter((lease) => new Date(`${lease.ends}T12:00:00`) >= new Date()).sort((a, b) => a.ends.localeCompare(b.ends)).slice(0, 3);
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <div className={styles.page}>
      <section className={styles.greeting}>
        <div><p className={styles.date}>{today}</p><p className={styles.eyebrow}>YOUR PORTFOLIO, AT A GLANCE</p><h1>Rentals, in good order.</h1><p>Keep residents cared for and every property moving forward.</p></div>
        <span className={styles.manager}><span>ML</span><span><strong>Morgan Lee</strong><small>Portfolio manager</small></span></span>
      </section>

      <section className={styles.stats} aria-label="Portfolio summary">
        <article className={styles.statCard}><span className={styles.statIcon}><FiHome aria-hidden="true" /></span><div><p>Homes managed</p><strong>{properties.length}</strong><small>{unitCount} total units</small></div><span className={styles.statFoot}>Portfolio</span></article>
        <article className={styles.statCard}><span className={`${styles.statIcon} ${styles.olive}`}><FiTrendingUp aria-hidden="true" /></span><div><p>Occupancy</p><strong>{occupancy}<small>%</small></strong><small>{occupiedCount} of {unitCount} homes occupied</small></div><span className={styles.statFoot}>Steady</span></article>
        <article className={styles.statCard}><span className={`${styles.statIcon} ${styles.gold}`}><FiDollarSign aria-hidden="true" /></span><div><p>Rent collected</p><strong>{money(collected)}</strong><small>of {money(monthlyRent)} expected</small></div><span className={`${styles.statFoot} ${styles.collected}`}>{collectionRate}% this month</span></article>
        <article className={styles.statCard}><span className={`${styles.statIcon} ${styles.clay}`}><FiTool aria-hidden="true" /></span><div><p>Open work orders</p><strong>{openRequests.length}</strong><small>{urgentCount} urgent requests</small></div><span className={`${styles.statFoot} ${urgentCount ? styles.attention : ""}`}>{urgentCount ? "Needs attention" : "On track"}</span></article>
      </section>

      <div className={styles.mainGrid}>
        <section className={styles.rentCard}>
          <div className={styles.sectionHead}><div><p>THIS MONTH</p><h2>Rent collection</h2></div><Link to="/leases">See all leases <FiArrowRight aria-hidden="true" /></Link></div>
          <div className={styles.collectionValue}><strong>{money(collected)}</strong><span>collected</span><span className={styles.collectionExpected}>of {money(monthlyRent)} expected</span></div>
          <div className={styles.progress}><span style={{ width: `${collectionRate}%` }} /></div>
          <div className={styles.progressFoot}><span>{collectionRate}% collected</span><span>{activeLeases.filter((lease) => lease.rentStatus !== "Paid").length} payments to follow up</span></div>
          <div className={styles.rentList}>
            <div className={styles.listHead}><h3>Needs a follow-up</h3><span>{rentFollowUp.length} residents</span></div>
            {rentFollowUp.length ? rentFollowUp.map((lease) => {
              const property = properties.find((item) => item.id === lease.propertyId);
              return <article className={styles.rentItem} key={lease.id}>
                <span className={styles.tenantMark}>{lease.tenant.split(" ").map((part) => part[0]).join("")}</span>
                <div className={styles.tenantInfo}><strong>{lease.tenant}</strong><span>{property?.name} <i>·</i> Unit {lease.unit}</span></div>
                <div className={styles.dueInfo}><strong>{money(lease.rent)}</strong><span className={lease.rentStatus === "Overdue" ? styles.overdue : styles.dueSoon}>{lease.rentStatus === "Overdue" ? `Past due ${shortDate(lease.rentDue)}` : `Due ${shortDate(lease.rentDue)}`}</span></div>
                <button className={styles.markPaid} type="button" onClick={() => onMarkPaid(lease.id)} aria-label={`Mark rent received for ${lease.tenant}`}><FiCheck aria-hidden="true" /> Received</button>
              </article>;
            }) : <p className={styles.clearMessage}><FiCheck aria-hidden="true" /> All active residents are up to date.</p>}
          </div>
        </section>

        <section className={styles.workCard}>
          <div className={styles.sectionHead}><div><p>PROPERTY CARE</p><h2>Work orders</h2></div><Link to="/maintenance">Open queue <FiArrowRight aria-hidden="true" /></Link></div>
          <div className={styles.workSummary}><span className={styles.workIcon}><FiTool aria-hidden="true" /></span><div><strong>{openRequests.length} active requests</strong><span>Across {properties.length} properties</span></div><span className={styles.urgentMark}>{urgentCount} urgent</span></div>
          <div className={styles.requestList}>
            {openRequests.slice(0, 4).map((request) => {
              const property = properties.find((item) => item.id === request.propertyId);
              return <Link className={styles.requestItem} to="/maintenance" key={request.id}>
                <span className={`${styles.priorityDot} ${styles[request.priority.toLowerCase()]}`} />
                <span className={styles.requestCopy}><strong>{request.title}</strong><small>{property?.name} <i>·</i> Unit {request.unit}</small></span>
                <span className={styles.requestStatus}>{request.status}</span><FiChevronRight aria-hidden="true" />
              </Link>;
            })}
          </div>
          <Link className={styles.maintenanceLink} to="/maintenance"><FiAlertCircle aria-hidden="true" /> Review maintenance requests <FiArrowRight aria-hidden="true" /></Link>
        </section>
      </div>

      <div className={styles.lowerGrid}>
        <section className={styles.portfolioCard}>
          <div className={styles.sectionHead}><div><p>THE NEIGHBORHOODS</p><h2>Your properties</h2></div><Link to="/properties">Portfolio view <FiArrowRight aria-hidden="true" /></Link></div>
          <div className={styles.propertyGrid}>
            {properties.slice(0, 4).map((property) => <Link className={styles.propertyTile} to={`/properties?property=${property.id}`} key={property.id}>
              <span className={`${styles.propertyArt} ${styles[property.accent]}`}><span><FiHome aria-hidden="true" /></span><small>{property.type}</small></span>
              <span className={styles.propertyInfo}><strong>{property.name}</strong><span><FiMapPin aria-hidden="true" /> {property.city}</span><span className={styles.occupancyTrack}><i style={{ width: `${Math.round(property.occupied / property.units * 100)}%` }} /></span><small>{property.occupied} of {property.units} homes occupied</small></span>
              <FiChevronRight aria-hidden="true" />
            </Link>)}
          </div>
        </section>

        <section className={styles.leaseCard}>
          <div className={styles.sectionHead}><div><p>COMING UP</p><h2>Lease dates</h2></div><Link to="/leases">All leases <FiArrowRight aria-hidden="true" /></Link></div>
          {leaseEndings.length ? <div className={styles.leaseList}>{leaseEndings.map((lease) => {
            const property = properties.find((item) => item.id === lease.propertyId);
            return <Link className={styles.leaseItem} to="/leases" key={lease.id}><span className={styles.calendarDate}><strong>{shortDate(lease.ends).split(" ")[1]}</strong><small>{shortDate(lease.ends).split(" ")[0]}</small></span><span><strong>{lease.tenant}</strong><small>{property?.name} <i>·</i> Unit {lease.unit}</small></span><span className={styles.expiry}><FiCalendar aria-hidden="true" /> {shortDate(lease.ends)}</span></Link>;
          })}</div> : <p className={styles.clearMessage}>No lease dates are coming up.</p>}
          <Link className={styles.leaseFooter} to="/leases">Plan a renewal <FiArrowRight aria-hidden="true" /></Link>
        </section>
      </div>

      <p className={styles.demoNote}>Hearthline is a frontend-only demo. Property, resident, payment, and maintenance details are fictional.</p>
    </div>
  );
};

export default Overview;
