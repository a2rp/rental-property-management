import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowDown, FiArrowRight, FiArrowUp, FiCalendar, FiCheck, FiClock, FiDollarSign, FiEdit2, FiFileText, FiMapPin, FiPlus, FiSearch, FiUser } from "react-icons/fi";
import ConfirmDialog from "../../components/confirmDialog";
import Dialog from "../../components/dialog";
import { dayOffset } from "../../data/seed";
import styles from "./styles.module.css";

const localDate = () => dayOffset(0);
const blankLease = () => ({ propertyId: "", tenant: "", email: "", unit: "", rent: "", deposit: "", dueDay: "1", starts: localDate(), ends: dayOffset(365) });
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const dateLabel = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));

const Leases = ({ leases, properties, onSaveLease, onMarkRentPaid, onEndLease, notify }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All leases");
  const [rentFilter, setRentFilter] = useState("All rent statuses");
  const [sort, setSort] = useState("end");
  const [dialog, setDialog] = useState(() => params.get("new") === "1" ? { type: "form", lease: null } : null);
  const [form, setForm] = useState(blankLease);
  const [errors, setErrors] = useState({});
  const [endTarget, setEndTarget] = useState(null);

  const filtered = useMemo(() => leases.filter((lease) => {
    const property = properties.find((item) => item.id === lease.propertyId);
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${lease.tenant} ${lease.email} ${lease.unit} ${lease.id} ${property?.name || ""}`.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "All leases" || lease.status === statusFilter;
    const matchesRent = rentFilter === "All rent statuses" || lease.rentStatus === rentFilter;
    return matchesSearch && matchesStatus && matchesRent;
  }).sort((a, b) => sort === "tenant" ? a.tenant.localeCompare(b.tenant) : sort === "rent" ? b.rent - a.rent : a.ends.localeCompare(b.ends)), [leases, properties, search, statusFilter, rentFilter, sort]);

  const active = leases.filter((lease) => lease.status === "Active");
  const pendingRent = active.filter((lease) => lease.rentStatus !== "Paid");
  const endingSoon = active.filter((lease) => lease.ends >= localDate() && lease.ends <= dayOffset(45)).length;
  const monthlyRent = active.reduce((sum, lease) => sum + lease.rent, 0);
  const selected = dialog?.lease;

  const cleanQuery = () => { if (location.search) navigate(location.pathname, { replace: true }); };
  const closeDialog = () => { setDialog(null); setErrors({}); cleanQuery(); };
  const openNew = () => { setForm({ ...blankLease(), propertyId: properties[0]?.id || "" }); setErrors({}); setDialog({ type: "form", lease: null }); };
  const openEdit = (lease) => { setForm({ propertyId: lease.propertyId, tenant: lease.tenant, email: lease.email, unit: lease.unit, rent: String(lease.rent), deposit: String(lease.deposit), dueDay: String(lease.dueDay), starts: lease.starts, ends: lease.ends }); setErrors({}); setDialog({ type: "form", lease }); };
  const updateField = (field, value) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: "" })); };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.propertyId) nextErrors.propertyId = "Choose a property.";
    if (!form.tenant.trim()) nextErrors.tenant = "Add the resident name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!form.unit.trim()) nextErrors.unit = "Add the home or unit number.";
    if (!Number.isFinite(Number(form.rent)) || Number(form.rent) <= 0) nextErrors.rent = "Enter a rent amount above zero.";
    if (!Number.isFinite(Number(form.deposit)) || Number(form.deposit) < 0) nextErrors.deposit = "Enter a valid deposit amount.";
    if (!Number.isInteger(Number(form.dueDay)) || Number(form.dueDay) < 1 || Number(form.dueDay) > 28) nextErrors.dueDay = "Choose a day from 1 to 28.";
    if (!form.starts || !form.ends || form.ends <= form.starts) nextErrors.ends = "The lease end must be after the start date.";
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) { notify("error", "Please review the lease details."); return; }
    const saved = onSaveLease({ ...form, tenant: form.tenant.trim(), email: form.email.trim(), unit: form.unit.trim(), rent: Number(form.rent), deposit: Number(form.deposit), dueDay: Number(form.dueDay) }, dialog.lease?.id);
    if (saved) closeDialog();
  };

  return (
    <div className={styles.page}>
      <section className={styles.heading}>
        <div><p className={styles.breadcrumb}>Portfolio <span>/</span> Leases</p><h1>Good agreements, clearly managed.</h1><p>Track terms, rent, and the people who make these places home.</p></div>
        <button className={styles.primary} type="button" onClick={openNew}><FiPlus aria-hidden="true" /> Add lease</button>
      </section>

      <section className={styles.metrics} aria-label="Lease summary">
        <div><span className={styles.metricIcon}><FiFileText aria-hidden="true" /></span><span><strong>{active.length}</strong><small>Active leases</small></span></div>
        <div><span className={`${styles.metricIcon} ${styles.gold}`}><FiDollarSign aria-hidden="true" /></span><span><strong>{money(monthlyRent)}</strong><small>Monthly rent</small></span></div>
        <div><span className={`${styles.metricIcon} ${styles.clay}`}><FiClock aria-hidden="true" /></span><span><strong>{pendingRent.length}</strong><small>Payments to follow up</small></span></div>
        <div><span className={`${styles.metricIcon} ${styles.olive}`}><FiCalendar aria-hidden="true" /></span><span><strong>{endingSoon}</strong><small>Ending in 45 days</small></span></div>
      </section>

      <section className={styles.leasePanel}>
        <div className={styles.panelHead}><div><p>RESIDENT AGREEMENTS</p><h2>Leases and rent</h2></div><span>{filtered.length} shown</span></div>
        <div className={styles.toolbar}>
          <label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a resident, property, or unit" aria-label="Search leases" /></label>
          <label className={styles.filter}>Lease<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All leases</option><option>Active</option><option>Ended</option></select></label>
          <label className={styles.filter}>Rent<select value={rentFilter} onChange={(event) => setRentFilter(event.target.value)}><option>All rent statuses</option><option>Paid</option><option>Due soon</option><option>Overdue</option></select></label>
          <button className={styles.sort} type="button" onClick={() => setSort((current) => current === "end" ? "tenant" : current === "tenant" ? "rent" : "end")} aria-label="Change lease sorting">{sort === "end" ? <><FiArrowUp aria-hidden="true" /> End date</> : sort === "tenant" ? <><FiArrowDown aria-hidden="true" /> Resident</> : <><FiArrowDown aria-hidden="true" /> Rent</>}</button>
        </div>

        {filtered.length ? <div className={styles.list}>
          <div className={styles.columnHead}><span>RESIDENT</span><span>PROPERTY / HOME</span><span>LEASE TERM</span><span>MONTHLY RENT</span><span>RENT STATUS</span><span>ACTIONS</span></div>
          {filtered.map((lease) => {
            const property = properties.find((item) => item.id === lease.propertyId);
            return <article className={styles.row} key={lease.id}>
              <button className={styles.resident} type="button" onClick={() => setDialog({ type: "details", lease })}><span>{lease.tenant.split(" ").map((part) => part[0]).join("")}</span><span><strong>{lease.tenant}</strong><small>{lease.email}</small></span></button>
              <span className={styles.property}><strong>{property?.name || "Property removed"}</strong><small>{property?.address || ""} <i>·</i> Unit {lease.unit}</small></span>
              <span className={styles.term}><strong>{dateLabel(lease.starts)}</strong><small>to {dateLabel(lease.ends)}</small></span>
              <strong className={styles.rent}>{money(lease.rent)}<small> / month</small></strong>
              <span className={`${styles.rentStatus} ${styles[lease.rentStatus.toLowerCase().replaceAll(" ", "-")]}`}><i />{lease.rentStatus}</span>
              <span className={styles.actions}>
                {lease.status === "Active" && lease.rentStatus !== "Paid" && <button type="button" className={styles.receive} onClick={() => onMarkRentPaid(lease.id)} aria-label={`Mark rent paid for ${lease.tenant}`}><FiCheck aria-hidden="true" /> Paid</button>}
                <button type="button" className={styles.iconButton} onClick={() => openEdit(lease)} aria-label={`Edit lease for ${lease.tenant}`}><FiEdit2 aria-hidden="true" /></button>
                <button type="button" className={styles.iconButton} onClick={() => setDialog({ type: "details", lease })} aria-label={`View lease for ${lease.tenant}`}><FiArrowRight aria-hidden="true" /></button>
              </span>
            </article>;
          })}
        </div> : <div className={styles.empty}><FiSearch aria-hidden="true" /><h3>No leases match</h3><p>Try another search or filter.</p><button type="button" onClick={() => { setSearch(""); setStatusFilter("All leases"); setRentFilter("All rent statuses"); }}>Clear filters</button></div>}
        <div className={styles.panelFoot}><FiCheck aria-hidden="true" /><span>Rent updates are demo entries and do not process payments.</span></div>
      </section>

      {dialog?.type === "form" && <Dialog title={dialog.lease ? "Update lease terms" : "Add a lease"} description="Keep resident and rental details accurate." onClose={closeDialog} size="large">
        <form className={styles.form} onSubmit={submit} noValidate>
          <label className={styles.field}>Property<select value={form.propertyId} onChange={(event) => updateField("propertyId", event.target.value)} aria-invalid={!!errors.propertyId}><option value="">Choose a property</option>{properties.filter((property) => property.status === "Active").map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select>{errors.propertyId && <span>{errors.propertyId}</span>}</label>
          <label className={styles.field}>Home or unit<input value={form.unit} onChange={(event) => updateField("unit", event.target.value)} placeholder="e.g. 3B" aria-invalid={!!errors.unit} />{errors.unit && <span>{errors.unit}</span>}</label>
          <label className={styles.field}>Resident name<input value={form.tenant} onChange={(event) => updateField("tenant", event.target.value)} placeholder="Full name" aria-invalid={!!errors.tenant} />{errors.tenant && <span>{errors.tenant}</span>}</label>
          <label className={styles.field}>Email address<input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="resident@example.com" aria-invalid={!!errors.email} />{errors.email && <span>{errors.email}</span>}</label>
          <label className={styles.field}>Monthly rent<input type="number" min="1" step="25" value={form.rent} onChange={(event) => updateField("rent", event.target.value)} aria-invalid={!!errors.rent} />{errors.rent && <span>{errors.rent}</span>}</label>
          <label className={styles.field}>Security deposit<input type="number" min="0" step="25" value={form.deposit} onChange={(event) => updateField("deposit", event.target.value)} aria-invalid={!!errors.deposit} />{errors.deposit && <span>{errors.deposit}</span>}</label>
          <label className={styles.field}>Rent due day<input type="number" min="1" max="28" value={form.dueDay} onChange={(event) => updateField("dueDay", event.target.value)} aria-invalid={!!errors.dueDay} />{errors.dueDay && <span>{errors.dueDay}</span>}</label>
          <label className={styles.field}>Lease start<input type="date" value={form.starts} onChange={(event) => updateField("starts", event.target.value)} aria-invalid={!!errors.ends} /></label>
          <label className={styles.field}>Lease end<input type="date" min={form.starts} value={form.ends} onChange={(event) => updateField("ends", event.target.value)} aria-invalid={!!errors.ends} />{errors.ends && <span>{errors.ends}</span>}</label>
          <div className={styles.formNote}><FiUser aria-hidden="true" /><span>Resident data is fictional and stays in this page session.</span></div>
          <div className={styles.formFoot}><button className={styles.secondary} type="button" onClick={closeDialog}>Go back</button><button className={styles.primary} type="submit">{dialog.lease ? "Save lease updates" : "Add lease"}</button></div>
        </form>
      </Dialog>}

      {dialog?.type === "details" && selected && <Dialog title={`${selected.tenant}'s lease`} description={`${properties.find((property) => property.id === selected.propertyId)?.name || "Property"} | Unit ${selected.unit}`} onClose={closeDialog}>
        <div className={styles.details}>
          <div><span>Monthly rent</span><strong>{money(selected.rent)}</strong></div><div><span>Deposit</span><strong>{money(selected.deposit)}</strong></div>
          <div><span>Agreement status</span><strong>{selected.status}</strong></div><div><span>Rent status</span><strong>{selected.rentStatus}</strong></div>
          <div className={styles.fullDetail}><span>Lease dates</span><strong>{dateLabel(selected.starts)} to {dateLabel(selected.ends)}</strong></div>
          <div className={styles.fullDetail}><span>Resident contact</span><strong>{selected.email}</strong></div>
        </div>
        <div className={styles.detailActions}>
          {selected.status === "Active" && selected.rentStatus !== "Paid" && <button className={styles.receive} type="button" onClick={() => { onMarkRentPaid(selected.id); closeDialog(); }}><FiCheck aria-hidden="true" /> Mark rent received</button>}
          <button className={styles.secondary} type="button" onClick={() => openEdit(selected)}><FiEdit2 aria-hidden="true" /> Edit terms</button>
          {selected.status === "Active" && <button className={styles.endButton} type="button" onClick={() => { setEndTarget(selected); setDialog(null); }}><FiMapPin aria-hidden="true" /> End lease</button>}
        </div>
      </Dialog>}

      {endTarget && <ConfirmDialog title={`End ${endTarget.tenant}'s lease?`} message="This agreement will move to the ended list and the home's occupied count will be updated." confirmLabel="End lease" onCancel={() => setEndTarget(null)} onConfirm={() => { onEndLease(endTarget.id); setEndTarget(null); cleanQuery(); }} />}
    </div>
  );
};

export default Leases;
