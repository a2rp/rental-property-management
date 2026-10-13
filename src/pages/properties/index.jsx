import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheck, FiChevronRight, FiEdit2, FiHome, FiMapPin, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import ConfirmDialog from "../../components/confirmDialog";
import Dialog from "../../components/dialog";
import styles from "./styles.module.css";

const propertyTypes = ["All property types", "Apartments", "Townhomes", "Single-family", "Duplex"];
const blankProperty = { name: "", address: "", city: "", type: "Apartments", units: "", occupied: "", monthlyPotential: "", owner: "Hearthline Residential", yearBuilt: "" };
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const Properties = ({ properties, leases, onSaveProperty, onRemoveProperty, notify }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All property types");
  const [sort, setSort] = useState("name");
  const [dialog, setDialog] = useState(() => params.get("new") === "1" ? { type: "form", property: null } : params.has("property") ? { type: "details", propertyId: params.get("property") } : null);
  const [form, setForm] = useState(blankProperty);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => properties.filter((property) => {
    const term = search.trim().toLowerCase();
    return (!term || `${property.name} ${property.address} ${property.city} ${property.owner}`.toLowerCase().includes(term)) && (type === "All property types" || property.type === type);
  }).sort((a, b) => sort === "occupancy" ? b.occupied / b.units - a.occupied / a.units : a.name.localeCompare(b.name)), [properties, search, type, sort]);
  const selected = dialog?.property || properties.find((property) => property.id === dialog?.propertyId);
  const activeLeases = selected ? leases.filter((lease) => lease.propertyId === selected.id && lease.status === "Active") : [];
  const occupied = properties.reduce((sum, property) => sum + property.occupied, 0);
  const units = properties.reduce((sum, property) => sum + property.units, 0);

  const cleanQuery = () => { if (location.search) navigate(location.pathname, { replace: true }); };
  const closeDialog = () => { setDialog(null); setErrors({}); cleanQuery(); };
  const openNew = () => { setForm(blankProperty); setErrors({}); setDialog({ type: "form", property: null }); };
  const openEdit = (property) => {
    setForm({ name: property.name, address: property.address, city: property.city, type: property.type, units: String(property.units), occupied: String(property.occupied), monthlyPotential: String(property.monthlyPotential), owner: property.owner, yearBuilt: String(property.yearBuilt) });
    setErrors({});
    setDialog({ type: "form", property });
  };
  const setField = (field, value) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: "" })); };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const unitCount = Number(form.units);
    const occupiedCount = Number(form.occupied);
    const potential = Number(form.monthlyPotential);
    if (!form.name.trim()) nextErrors.name = "Add a property name.";
    if (!form.address.trim()) nextErrors.address = "Add a street address.";
    if (!form.city.trim()) nextErrors.city = "Add a city and state.";
    if (!Number.isInteger(unitCount) || unitCount < 1) nextErrors.units = "Enter at least one unit.";
    if (!Number.isInteger(occupiedCount) || occupiedCount < 0 || occupiedCount > unitCount) nextErrors.occupied = "Occupied units must fit within the property total.";
    if (!Number.isFinite(potential) || potential <= 0) nextErrors.monthlyPotential = "Add the monthly rent potential.";
    if (!Number.isInteger(Number(form.yearBuilt)) || Number(form.yearBuilt) < 1800 || Number(form.yearBuilt) > new Date().getFullYear() + 1) nextErrors.yearBuilt = "Enter a valid year.";
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) { notify("error", "Please review the property details."); return; }
    const saved = onSaveProperty({ ...form, name: form.name.trim(), address: form.address.trim(), city: form.city.trim(), owner: form.owner.trim(), units: unitCount, occupied: occupiedCount, monthlyPotential: potential, yearBuilt: Number(form.yearBuilt) }, dialog.property?.id);
    if (saved) closeDialog();
  };

  return (
    <div className={styles.page}>
      <section className={styles.heading}>
        <div><p className={styles.breadcrumb}>Portfolio <span>/</span> Properties</p><h1>Places people call home.</h1><p>Keep every building, unit, and ownership detail in view.</p></div>
        <button className={styles.primary} type="button" onClick={openNew}><FiPlus aria-hidden="true" /> Add property</button>
      </section>

      <section className={styles.summary} aria-label="Property portfolio summary">
        <div><span className={styles.summaryIcon}><FiHome aria-hidden="true" /></span><span><strong>{properties.length}</strong><small>Properties</small></span></div>
        <div><span className={`${styles.summaryIcon} ${styles.green}`}><FiUsers aria-hidden="true" /></span><span><strong>{occupied} <i>/ {units}</i></strong><small>Occupied homes</small></span></div>
        <div><span className={`${styles.summaryIcon} ${styles.gold}`}><FiCheck aria-hidden="true" /></span><span><strong>{units ? Math.round(occupied / units * 100) : 0}%</strong><small>Portfolio occupancy</small></span></div>
        <div className={styles.summaryNote}><span>Every address, one thoughtful overview.</span><FiArrowRight aria-hidden="true" /></div>
      </section>

      <section className={styles.portfolio}>
        <div className={styles.listHead}><div><p>YOUR PLACES</p><h2>Property portfolio</h2></div><span>{filtered.length} shown</span></div>
        <div className={styles.toolbar}>
          <label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, address, or owner" aria-label="Search properties" /></label>
          <label className={styles.filter}>Property type<select value={type} onChange={(event) => setType(event.target.value)}>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button className={styles.sort} type="button" onClick={() => setSort((current) => current === "name" ? "occupancy" : "name")}>Sort: {sort === "name" ? "Name" : "Occupancy"}</button>
        </div>

        {filtered.length ? <div className={styles.grid}>{filtered.map((property) => {
          const active = leases.filter((lease) => lease.propertyId === property.id && lease.status === "Active");
          const occupancy = Math.round(property.occupied / property.units * 100);
          const canRemove = active.length === 0;
          return <article className={styles.card} key={property.id}>
            <button className={`${styles.art} ${styles[property.accent]}`} type="button" onClick={() => setDialog({ type: "details", propertyId: property.id })} aria-label={`View ${property.name}`}>
              <span className={styles.artLabel}><FiHome aria-hidden="true" /> {property.type}</span><span className={styles.buildingArt} aria-hidden="true"><i /><i /><i /></span><span className={styles.artNumber}>{property.id}</span>
            </button>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}><div><h3>{property.name}</h3><span><FiMapPin aria-hidden="true" /> {property.address}, {property.city}</span></div><span className={styles.activeTag}>{property.status}</span></div>
              <div className={styles.cardStats}><div><strong>{property.occupied}<small> / {property.units}</small></strong><span>Homes occupied</span></div><div><strong>{money(property.monthlyPotential)}</strong><span>Monthly potential</span></div></div>
              <div className={styles.occupancy}><div><span>Occupancy</span><strong>{occupancy}%</strong></div><span className={styles.track}><i style={{ width: `${occupancy}%` }} /></span></div>
              <div className={styles.cardActions}><button type="button" onClick={() => setDialog({ type: "details", propertyId: property.id })}>Property details <FiChevronRight aria-hidden="true" /></button><button type="button" onClick={() => openEdit(property)} aria-label={`Edit ${property.name}`}><FiEdit2 aria-hidden="true" /></button><button type="button" onClick={() => setDeleteTarget(property)} disabled={!canRemove} title={canRemove ? "Remove property" : "End active leases before removing this property"} aria-label={`Remove ${property.name}`}><FiTrash2 aria-hidden="true" /></button></div>
            </div>
          </article>;
        })}</div> : <div className={styles.empty}><FiSearch aria-hidden="true" /><h3>No properties match</h3><p>Try another search or property type.</p><button type="button" onClick={() => { setSearch(""); setType("All property types"); }}>Clear filters</button></div>}
      </section>

      <p className={styles.demoNote}>Property and occupancy figures are sample data for this frontend demo.</p>

      {dialog?.type === "form" && <Dialog title={dialog.property ? "Update property details" : "Add a property"} description="Keep the portfolio record clear and up to date." onClose={closeDialog} size="large">
        <form className={styles.form} onSubmit={submit} noValidate>
          <label className={styles.field}>Property name<input value={form.name} onChange={(event) => setField("name", event.target.value)} placeholder="e.g. Orchard Place" aria-invalid={!!errors.name} />{errors.name && <span>{errors.name}</span>}</label>
          <label className={styles.field}>Property type<select value={form.type} onChange={(event) => setField("type", event.target.value)}>{propertyTypes.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className={styles.field}>Street address<input value={form.address} onChange={(event) => setField("address", event.target.value)} placeholder="Street and number" aria-invalid={!!errors.address} />{errors.address && <span>{errors.address}</span>}</label>
          <label className={styles.field}>City and state<input value={form.city} onChange={(event) => setField("city", event.target.value)} placeholder="Portland, OR" aria-invalid={!!errors.city} />{errors.city && <span>{errors.city}</span>}</label>
          <label className={styles.field}>Total homes<input type="number" min="1" step="1" value={form.units} onChange={(event) => setField("units", event.target.value)} aria-invalid={!!errors.units} />{errors.units && <span>{errors.units}</span>}</label>
          <label className={styles.field}>Occupied homes<input type="number" min="0" step="1" value={form.occupied} onChange={(event) => setField("occupied", event.target.value)} aria-invalid={!!errors.occupied} />{errors.occupied && <span>{errors.occupied}</span>}</label>
          <label className={styles.field}>Monthly rent potential<input type="number" min="1" step="100" value={form.monthlyPotential} onChange={(event) => setField("monthlyPotential", event.target.value)} aria-invalid={!!errors.monthlyPotential} />{errors.monthlyPotential && <span>{errors.monthlyPotential}</span>}</label>
          <label className={styles.field}>Year built<input type="number" min="1800" max={new Date().getFullYear() + 1} value={form.yearBuilt} onChange={(event) => setField("yearBuilt", event.target.value)} aria-invalid={!!errors.yearBuilt} />{errors.yearBuilt && <span>{errors.yearBuilt}</span>}</label>
          <label className={`${styles.field} ${styles.full}`}>Ownership or management group<input value={form.owner} onChange={(event) => setField("owner", event.target.value)} placeholder="Company or owner" /></label>
          <div className={styles.formFoot}><p>This record is saved in page state and resets on refresh.</p><div><button className={styles.secondary} type="button" onClick={closeDialog}>Go back</button><button className={styles.primary} type="submit">{dialog.property ? "Save updates" : "Add to portfolio"}</button></div></div>
        </form>
      </Dialog>}

      {dialog?.type === "details" && selected && <Dialog title={selected.name} description={`${selected.address}, ${selected.city}`} onClose={closeDialog} size="large">
        <div className={styles.detail}>
          <div className={`${styles.detailArt} ${styles[selected.accent]}`}><span className={styles.buildingArt}><i /><i /><i /></span><span>{selected.type}</span></div>
          <div className={styles.detailInfo}><p>PROPERTY SNAPSHOT</p><h3>{selected.name}</h3><span><FiMapPin aria-hidden="true" /> {selected.address}, {selected.city}</span>
            <div className={styles.detailStats}><div><strong>{selected.units}</strong><span>Total homes</span></div><div><strong>{selected.occupied}</strong><span>Occupied</span></div><div><strong>{money(selected.monthlyPotential)}</strong><span>Monthly potential</span></div></div>
            <div className={styles.detailRows}><div><span>Managed by</span><strong>{selected.owner}</strong></div><div><span>Year built</span><strong>{selected.yearBuilt}</strong></div><div><span>Active leases</span><strong>{activeLeases.length}</strong></div></div>
          </div>
        </div>
        <div className={styles.detailActions}><p>{activeLeases.length ? "This property has active leases. End those leases before removing it." : "No active leases are linked to this property."}</p><div><button className={styles.secondary} type="button" onClick={() => openEdit(selected)}><FiEdit2 aria-hidden="true" /> Edit details</button><button className={styles.removeButton} type="button" disabled={activeLeases.length > 0} onClick={() => { setDeleteTarget(selected); setDialog(null); }}><FiTrash2 aria-hidden="true" /> Remove property</button></div></div>
      </Dialog>}

      {deleteTarget && <ConfirmDialog title={`Remove ${deleteTarget.name}?`} message="The property will be removed from this demo portfolio. This action cannot be undone." confirmLabel="Remove property" onCancel={() => setDeleteTarget(null)} onConfirm={() => { onRemoveProperty(deleteTarget.id); setDeleteTarget(null); cleanQuery(); }} />}
    </div>
  );
};

export default Properties;
