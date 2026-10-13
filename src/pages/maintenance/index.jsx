import { useMemo, useState } from "react";
import { FiAlertCircle, FiArrowRight, FiCalendar, FiCheck, FiChevronRight, FiClock, FiMapPin, FiPlus, FiSearch, FiTool, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../../components/confirmDialog";
import Dialog from "../../components/dialog";
import styles from "./styles.module.css";

const categories = ["Plumbing", "Electrical", "Heating", "Appliance", "General repair", "Safety", "Landscaping"];
const priorities = ["Urgent", "High", "Normal"];
const statuses = ["Open", "Scheduled", "In progress", "Completed"];
const blankRequest = { title: "", category: "Plumbing", propertyId: "", unit: "", resident: "", priority: "Normal", details: "" };
const dateLabel = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));

const Maintenance = ({ requests, properties, onCreateRequest, onUpdateRequest, onDeleteRequest, notify }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(blankRequest);
  const [errors, setErrors] = useState({});
  const [statusDraft, setStatusDraft] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => requests.filter((request) => {
    const property = properties.find((item) => item.id === request.propertyId);
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${request.title} ${request.category} ${request.resident} ${request.unit} ${property?.name || ""}`.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "All statuses" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "All priorities" || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => b.created.localeCompare(a.created)), [requests, properties, search, statusFilter, priorityFilter]);

  const openCount = requests.filter((request) => request.status !== "Completed").length;
  const urgentCount = requests.filter((request) => request.status !== "Completed" && request.priority === "Urgent").length;
  const progressCount = requests.filter((request) => request.status === "In progress" || request.status === "Scheduled").length;
  const selected = requests.find((request) => request.id === dialog?.requestId);

  const openNew = () => { setForm({ ...blankRequest, propertyId: properties[0]?.id || "" }); setErrors({}); setDialog({ type: "form" }); };
  const openDetails = (request) => { setStatusDraft(request.status); setDialog({ type: "details", requestId: request.id }); };
  const closeDialog = () => { setDialog(null); setErrors({}); };
  const updateField = (field, value) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: "" })); };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Add a short request title.";
    if (!form.propertyId) nextErrors.propertyId = "Choose a property.";
    if (!form.unit.trim()) nextErrors.unit = "Add the home or unit number.";
    if (!form.resident.trim()) nextErrors.resident = "Add the resident name.";
    if (form.details.trim().length < 8) nextErrors.details = "Add a few details to help the team prepare.";
    if (form.details.trim().length > 360) nextErrors.details = "Keep the request under 360 characters.";
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) { notify("error", "Please review the maintenance request."); return; }
    const saved = onCreateRequest({ ...form, title: form.title.trim(), unit: form.unit.trim(), resident: form.resident.trim(), details: form.details.trim() });
    if (saved) closeDialog();
  };

  return (
    <div className={styles.page}>
      <section className={styles.heading}>
        <div><p className={styles.breadcrumb}>Portfolio <span>/</span> Maintenance</p><h1>Keep every home in good repair.</h1><p>Stay close to resident requests and the work that keeps things running.</p></div>
        <button className={styles.primary} type="button" onClick={openNew}><FiPlus aria-hidden="true" /> New request</button>
      </section>

      <section className={styles.summary} aria-label="Maintenance summary">
        <div><span className={styles.summaryIcon}><FiTool aria-hidden="true" /></span><span><strong>{openCount}</strong><small>Active requests</small></span></div>
        <div><span className={`${styles.summaryIcon} ${styles.red}`}><FiAlertCircle aria-hidden="true" /></span><span><strong>{urgentCount}</strong><small>Urgent attention</small></span></div>
        <div><span className={`${styles.summaryIcon} ${styles.gold}`}><FiClock aria-hidden="true" /></span><span><strong>{progressCount}</strong><small>Scheduled or underway</small></span></div>
        <div><span className={`${styles.summaryIcon} ${styles.green}`}><FiCheck aria-hidden="true" /></span><span><strong>{requests.filter((request) => request.status === "Completed").length}</strong><small>Recently completed</small></span></div>
      </section>

      <section className={styles.queue}>
        <div className={styles.queueHead}><div><p>PROPERTY CARE</p><h2>Maintenance queue</h2></div><span>{filtered.length} requests shown</span></div>
        <div className={styles.filters}>
          <label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search request, resident, or property" aria-label="Search maintenance requests" /></label>
          <label className={styles.filter}>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className={styles.filter}>Priority<select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option>All priorities</option>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
        </div>

        {filtered.length ? <div className={styles.grid}>{filtered.map((request) => {
          const property = properties.find((item) => item.id === request.propertyId);
          return <article className={`${styles.ticket} ${styles[request.priority.toLowerCase()]}`} key={request.id}>
            <div className={styles.ticketTop}><span className={`${styles.priority} ${styles[request.priority.toLowerCase()]}`}><i />{request.priority}</span><span className={styles.ticketId}>{request.id}</span></div>
            <button className={styles.ticketTitle} type="button" onClick={() => openDetails(request)}>{request.title}<FiChevronRight aria-hidden="true" /></button>
            <p className={styles.ticketDetails}>{request.details}</p>
            <div className={styles.ticketMeta}><span><FiTool aria-hidden="true" /> {request.category}</span><span><FiCalendar aria-hidden="true" /> {dateLabel(request.created)}</span></div>
            <div className={styles.address}><span className={styles.homeMark}><FiMapPin aria-hidden="true" /></span><span><strong>{property?.name || "Property removed"}</strong><small>Unit {request.unit} <i>·</i> {request.resident}</small></span></div>
            <div className={styles.ticketFoot}><label>Status<select value={request.status} onChange={(event) => onUpdateRequest(request.id, event.target.value)} aria-label={`Update status for ${request.title}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><button type="button" onClick={() => openDetails(request)}>View request <FiArrowRight aria-hidden="true" /></button></div>
          </article>;
        })}</div> : <div className={styles.empty}><FiSearch aria-hidden="true" /><h3>No requests match</h3><p>Try another search, status, or priority.</p><button type="button" onClick={() => { setSearch(""); setStatusFilter("All statuses"); setPriorityFilter("All priorities"); }}>Clear filters</button></div>}
        <div className={styles.queueFoot}><FiCheck aria-hidden="true" /><span>Request statuses update this demo workspace only. No vendor has been contacted.</span></div>
      </section>

      {dialog?.type === "form" && <Dialog title="Create a maintenance request" description="Add enough detail for the property team to plan the next step." onClose={closeDialog} size="large">
        <form className={styles.form} onSubmit={submit} noValidate>
          <label className={styles.field}>Request title<input value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="e.g. Bedroom window will not latch" aria-invalid={!!errors.title} />{errors.title && <span>{errors.title}</span>}</label>
          <label className={styles.field}>Category<select value={form.category} onChange={(event) => updateField("category", event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className={styles.field}>Property<select value={form.propertyId} onChange={(event) => updateField("propertyId", event.target.value)} aria-invalid={!!errors.propertyId}><option value="">Choose a property</option>{properties.filter((property) => property.status === "Active").map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select>{errors.propertyId && <span>{errors.propertyId}</span>}</label>
          <label className={styles.field}>Home or unit<input value={form.unit} onChange={(event) => updateField("unit", event.target.value)} placeholder="e.g. 3B" aria-invalid={!!errors.unit} />{errors.unit && <span>{errors.unit}</span>}</label>
          <label className={styles.field}>Resident name<input value={form.resident} onChange={(event) => updateField("resident", event.target.value)} placeholder="Full name" aria-invalid={!!errors.resident} />{errors.resident && <span>{errors.resident}</span>}</label>
          <label className={styles.field}>Priority<select value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
          <label className={`${styles.field} ${styles.full}`}>What needs attention?<textarea rows="4" maxLength="360" value={form.details} onChange={(event) => updateField("details", event.target.value)} placeholder="Describe what is happening and when it started." aria-invalid={!!errors.details} />{errors.details && <span>{errors.details}</span>}<small>{form.details.length}/360</small></label>
          <div className={styles.formFoot}><p>New requests start in the open queue.</p><div><button className={styles.secondary} type="button" onClick={closeDialog}>Go back</button><button className={styles.primary} type="submit"><FiPlus aria-hidden="true" /> Add request</button></div></div>
        </form>
      </Dialog>}

      {dialog?.type === "details" && selected && <Dialog title={selected.title} description={`${selected.id} | ${selected.category}`} onClose={closeDialog}>
        <div className={styles.details}>
          <div className={styles.detailsLine}><span>Priority</span><strong className={`${styles.priority} ${styles[selected.priority.toLowerCase()]}`}><i />{selected.priority}</strong></div>
          <div className={styles.detailsLine}><span>Status</span><strong>{selected.status}</strong></div>
          <div className={styles.detailsLine}><span>Property</span><strong>{properties.find((property) => property.id === selected.propertyId)?.name || "Property removed"} | Unit {selected.unit}</strong></div>
          <div className={styles.detailsLine}><span>Resident</span><strong>{selected.resident}</strong></div>
          <div className={styles.detailsLine}><span>Reported</span><strong>{dateLabel(selected.created)}</strong></div>
          <p>{selected.details}</p>
          <label className={styles.field}>Update request status<select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        </div>
        <div className={styles.detailActions}><button className={styles.removeButton} type="button" onClick={() => { setDeleteTarget(selected); setDialog(null); }}><FiTrash2 aria-hidden="true" /> Remove request</button><button className={styles.primary} type="button" onClick={() => { onUpdateRequest(selected.id, statusDraft); closeDialog(); }}>Save status</button></div>
      </Dialog>}

      {deleteTarget && <ConfirmDialog title="Remove this maintenance request?" message={`${deleteTarget.title} will be removed from the property queue.`} confirmLabel="Remove request" onCancel={() => setDeleteTarget(null)} onConfirm={() => { onDeleteRequest(deleteTarget.id); setDeleteTarget(null); }} />}
    </div>
  );
};

export default Maintenance;
