import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiBell, FiCalendar, FiDollarSign, FiTool } from "react-icons/fi";
import AppRoutes from "./AppRoutes";
import Dialog from "./components/dialog";
import Footer from "./components/footer";
import Header from "./components/header";
import Toast from "./components/toast";
import { dayOffset, initialLeases, initialProperties, initialRequests } from "./data/seed";
import styles from "./App.module.css";

const dateLabel = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const App = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState(initialProperties);
  const [leases, setLeases] = useState(initialLeases);
  const [requests, setRequests] = useState(initialRequests);
  const [toasts, setToasts] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsViewed, setNotificationsViewed] = useState(false);

  const notify = (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, type, message }]);
  };

  const dismissToast = (id) => setToasts((current) => current.filter((item) => item.id !== id));

  const attentionItems = useMemo(() => {
    const rentItems = leases
      .filter((lease) => lease.status === "Active" && lease.rentStatus !== "Paid")
      .map((lease) => ({
        id: `rent-${lease.id}`,
        title: `${lease.tenant} - ${lease.rentStatus.toLowerCase()} rent`,
        detail: `${money(lease.rent)} at ${properties.find((property) => property.id === lease.propertyId)?.name || "a property"}`,
        route: "/leases",
        icon: FiDollarSign,
        tone: lease.rentStatus === "Overdue" ? "danger" : "warm",
      }));
    const workItems = requests
      .filter((request) => request.status !== "Completed" && ["Urgent", "High"].includes(request.priority))
      .map((request) => ({
        id: `work-${request.id}`,
        title: request.title,
        detail: `${request.priority} priority - ${properties.find((property) => property.id === request.propertyId)?.name || "a property"}`,
        route: "/maintenance",
        icon: request.priority === "Urgent" ? FiAlertCircle : FiTool,
        tone: request.priority === "Urgent" ? "danger" : "warm",
      }));
    const leaseItems = leases
      .filter((lease) => lease.status === "Active" && lease.ends >= dayOffset(0) && lease.ends <= dayOffset(45))
      .map((lease) => ({
        id: `lease-${lease.id}`,
        title: `${lease.tenant}'s lease is ending soon`,
        detail: `${properties.find((property) => property.id === lease.propertyId)?.name || "Property"} - ends ${dateLabel(lease.ends)}`,
        route: "/leases",
        icon: FiCalendar,
        tone: "cool",
      }));
    return [...rentItems, ...workItems, ...leaseItems];
  }, [leases, properties, requests]);

  const saveProperty = (input, id) => {
    if (id) {
      const activeCount = leases.filter((lease) => lease.propertyId === id && lease.status === "Active").length;
      if (input.occupied < activeCount) {
        notify("error", `Occupied homes cannot be fewer than ${activeCount} active leases.`);
        return false;
      }
      setProperties((current) => current.map((property) => property.id === id ? { ...property, ...input } : property));
      notify("success", `${input.name} details updated.`);
      setNotificationsViewed(false);
      return true;
    }

    const nextId = Math.max(500, ...properties.map((property) => Number(property.id.replace("PR-", "")) || 0)) + 1;
    const accents = ["sage", "clay", "olive", "gold"];
    setProperties((current) => [...current, { ...input, id: `PR-${nextId}`, status: "Active", accent: accents[current.length % accents.length] }]);
    notify("success", `${input.name} was added to the portfolio.`);
    setNotificationsViewed(false);
    return true;
  };

  const removeProperty = (id) => {
    const property = properties.find((item) => item.id === id);
    if (leases.some((lease) => lease.propertyId === id && lease.status === "Active")) {
      notify("error", "End active leases before removing this property.");
      return;
    }
    setProperties((current) => current.filter((item) => item.id !== id));
    setLeases((current) => current.filter((lease) => lease.propertyId !== id));
    setRequests((current) => current.filter((request) => request.propertyId !== id));
    notify("success", `${property?.name || "Property"} and its archived records were removed.`);
    setNotificationsViewed(false);
  };

  const saveLease = (input, id) => {
    const existing = leases.find((lease) => lease.id === id);
    const property = properties.find((item) => item.id === input.propertyId);
    if (!property || property.status !== "Active") {
      notify("error", "Choose an active property before saving this lease.");
      return false;
    }
    const unitConflict = leases.some((lease) => lease.id !== id && lease.status === "Active" && lease.propertyId === input.propertyId && lease.unit.toLowerCase() === input.unit.toLowerCase());
    if (unitConflict) {
      notify("error", `Unit ${input.unit} already has an active lease at ${property.name}.`);
      return false;
    }
    const isNewActive = !existing;
    const movesProperty = existing?.status === "Active" && existing.propertyId !== input.propertyId;
    const needsNewUnit = isNewActive || movesProperty;
    if (needsNewUnit && property.occupied >= property.units) {
      notify("error", `${property.name} has no vacant units available.`);
      return false;
    }
    const updated = existing
      ? { ...existing, ...input, ...(existing.rentStatus === "Paid" ? { rentStatus: "Due soon", rentDue: dayOffset(0), paidOn: undefined } : {}) }
      : {
        ...input,
        id: `LS-${Math.max(2400, ...leases.map((lease) => Number(lease.id.replace("LS-", "")) || 0)) + 1}`,
        status: "Active",
        rentStatus: "Due soon",
        rentDue: dayOffset(0),
      };

    setLeases((current) => existing ? current.map((lease) => lease.id === id ? updated : lease) : [...current, updated]);
    if (needsNewUnit) {
      setProperties((current) => current.map((item) => item.id === input.propertyId ? { ...item, occupied: item.occupied + 1 } : item));
    }
    if (movesProperty) {
      setProperties((current) => current.map((item) => item.id === existing.propertyId ? { ...item, occupied: Math.max(0, item.occupied - 1) } : item));
    }
    notify("success", `${input.tenant}'s lease ${existing ? "was updated" : "was added"}.`);
    setNotificationsViewed(false);
    return true;
  };

  const markRentPaid = (id) => {
    const lease = leases.find((item) => item.id === id);
    if (!lease || lease.status !== "Active") return;
    setLeases((current) => current.map((item) => item.id === id ? { ...item, rentStatus: "Paid", paidOn: dayOffset(0) } : item));
    notify("success", `Rent for ${lease.tenant} was marked received. No payment was processed.`);
    setNotificationsViewed(false);
  };

  const endLease = (id) => {
    const lease = leases.find((item) => item.id === id);
    if (!lease || lease.status !== "Active") return;
    setLeases((current) => current.map((item) => item.id === id ? { ...item, status: "Ended" } : item));
    setProperties((current) => current.map((property) => property.id === lease.propertyId ? { ...property, occupied: Math.max(0, property.occupied - 1) } : property));
    notify("success", `${lease.tenant}'s lease ended and occupancy was updated.`);
    setNotificationsViewed(false);
  };

  const createRequest = (input) => {
    const property = properties.find((item) => item.id === input.propertyId);
    if (!property || property.status !== "Active") {
      notify("error", "Choose an active property for this request.");
      return false;
    }
    const nextId = Math.max(8100, ...requests.map((request) => Number(request.id.replace("MR-", "")) || 0)) + 1;
    setRequests((current) => [...current, { ...input, id: `MR-${nextId}`, created: dayOffset(0), status: "Open" }]);
    notify("success", `The request for ${property.name} was added to the queue.`);
    setNotificationsViewed(false);
    return true;
  };

  const updateRequest = (id, status) => {
    const request = requests.find((item) => item.id === id);
    if (!request || request.status === status) return;
    setRequests((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    notify("success", `"${request.title}" moved to ${status.toLowerCase()}.`);
    setNotificationsViewed(false);
  };

  const deleteRequest = (id) => {
    const request = requests.find((item) => item.id === id);
    setRequests((current) => current.filter((item) => item.id !== id));
    notify("success", `"${request?.title || "Maintenance request"}" was removed.`);
    setNotificationsViewed(false);
  };

  const handlers = {
    onSaveProperty: saveProperty,
    onRemoveProperty: removeProperty,
    onSaveLease: saveLease,
    onMarkRentPaid: markRentPaid,
    onEndLease: endLease,
    onCreateRequest: createRequest,
    onUpdateRequest: updateRequest,
    onDeleteRequest: deleteRequest,
  };

  const openNotifications = () => {
    setNotificationsViewed(true);
    setNotificationsOpen(true);
  };

  return (
    <div className={styles.appShell}>
      <Header unreadCount={notificationsViewed ? 0 : attentionItems.length} onOpenNotifications={openNotifications} />
      <main id="main-content" className={styles.mainContent}>
        <AppRoutes properties={properties} leases={leases} requests={requests} handlers={handlers} notify={notify} />
      </main>
      <Footer />
      <Toast items={toasts} onDismiss={dismissToast} />

      {notificationsOpen && <Dialog title="Portfolio attention" description="Items that may need a follow-up across your rentals." onClose={() => setNotificationsOpen(false)} size="large">
        {attentionItems.length ? <div className={styles.attentionList}>{attentionItems.map((item) => {
          const Icon = item.icon;
          return <button className={styles.attentionItem} type="button" key={item.id} onClick={() => { setNotificationsOpen(false); navigate(item.route); }}>
            <span className={`${styles.attentionIcon} ${styles[item.tone]}`}><Icon aria-hidden="true" /></span>
            <span><strong>{item.title}</strong><small>{item.detail}</small></span>
          </button>;
        })}</div> : <div className={styles.allClear}><FiBell aria-hidden="true" /><h3>Everything is up to date.</h3><p>No rent, lease, or maintenance follow-ups are waiting.</p></div>}
      </Dialog>}
    </div>
  );
};

export default App;
